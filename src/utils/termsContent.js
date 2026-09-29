/** Arrange API rich text into cards without replacing its wording or numbering. */
export function parseTermsContent(content, imageBase = "") {
  const source = String(content || "").trim();
  if (!source) return [];
  const doc = new DOMParser().parseFromString(source, "text/html");
  const absolute = (src) =>
    /^(?:https?:|data:|blob:|\/\/)/i.test(src)
      ? src
      : `${imageBase}${src.startsWith("/") ? "" : "/"}${src}`;
  if (!/<[a-z][\s\S]*>/i.test(source)) {
    doc.body.replaceChildren();
    if (/\.(?:png|jpe?g|gif|webp|svg)(?:\?.*)?$/i.test(source)) {
      const img = doc.createElement("img");
      img.src = absolute(source);
      doc.body.append(img);
    } else {
      source.split(/\r?\n/).forEach((line) => {
        const p = doc.createElement("p");
        p.textContent = line;
        doc.body.append(p);
      });
    }
  }
  doc.querySelectorAll("img[src]").forEach((img) => {
    img.setAttribute("src", absolute(img.getAttribute("src")));
  });

  const blocks = [];
  const collect = (parent) => {
    Array.from(parent.childNodes).forEach((node) => {
      if (node.nodeType === 1 && /^(DIV|SECTION|ARTICLE)$/.test(node.tagName)) {
        collect(node);
      } else if (
        node.textContent.trim() ||
        node.querySelector?.("img") ||
        node.tagName === "IMG"
      ) {
        if (node.nodeType === 3) {
          const p = doc.createElement("p");
          p.textContent = node.textContent;
          blocks.push(p);
        } else if (node.nodeType === 1) {
          blocks.push(node.cloneNode(true));
        }
      }
    });
  };
  collect(doc.body);

  const removePrefix = (node, length) => {
    const walker = doc.createTreeWalker(node, 4);
    let text;
    while (length && (text = walker.nextNode())) {
      const count = Math.min(length, text.textContent.length);
      text.textContent = text.textContent.slice(count);
      length -= count;
    }
    return node.innerHTML;
  };
  const sections = [];
  let section;
  for (const block of blocks) {
    const text = block.textContent;
    const sub = text.match(/^\s*(\d+(?:\.\d+)+)[)）.]?\s*/);
    const main =
      !sub && text.match(/^\s*(?:(\d+)[)）、.](?!\d)|[（(]([A-Za-z])[)）])\s*/);
    const heading = /^H[1-6]$/.test(block.tagName);
    if (main || heading) {
      section = {
        number: main ? main[1] || main[2] : "",
        title: main ? removePrefix(block, main[0].length) : block.innerHTML,
        blocks: [],
      };
      sections.push(section);
    } else {
      if (!section) {
        section = { number: "", title: "", blocks: [] };
        sections.push(section);
      }
      section.blocks.push({
        number: sub ? sub[1] : "",
        html: sub ? removePrefix(block, sub[0].length) : block.outerHTML,
      });
    }
  }
  return sections;
}
