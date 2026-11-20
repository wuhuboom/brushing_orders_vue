<template>
  <div class="elementor-element e-con e-div-block-base e-34d66ca4-23c9">
    <footer class="elementor-element e-con e-flexbox-base wm-section-dark e-277f64b6-b19c">
      <div class="elementor-element e-con e-flexbox-base e-a5eee04-3607">
        <div class="elementor-element e-con e-flexbox-base e-4f20c01a-11e4">
          <div class="elementor-element e-con e-flexbox-base e-78c0dfa4-2047">
            <p class="e-79062f9a-c642 e-paragraph-base">Let&apos;s make something good.</p>
            <h2 class="e-2e2ff390-cfb9 e-heading-base">Websites, SEO and branding for Iowa businesses.</h2>
            <a href="#" class="e-4f0e21b6-8728 e-button-base"> Start your project </a>
          </div>
          <div class="elementor-element e-con e-flexbox-base e-5cf906be-b1ee">
            <p class="e-7cf96ab5-8693 e-paragraph-base">Services</p>
            <span class="e-1c9f1288-d940 e-paragraph-base"
              ><a href="#" class="e-paragraph-link-base"> Web Design </a></span
            >
            <span class="e-383ff2f3-138a e-paragraph-base"
              ><a href="#" class="e-paragraph-link-base"> SEO &amp; Analytics </a></span
            >
            <span class="e-62c657c7-dfd6 e-paragraph-base"
              ><a href="#" class="e-paragraph-link-base"> Branding </a></span
            >
            <span class="e-78fa86c1-e5cf e-paragraph-base"
              ><a href="#" class="e-paragraph-link-base"> Print &amp; Digital Design </a></span
            >
            <span class="e-2766b03a-3f8c e-paragraph-base"
              ><a href="#" class="e-paragraph-link-base"> Website Maintenance </a></span
            >
          </div>
          <div class="elementor-element e-con e-flexbox-base e-6b86da3a-c243">
            <p class="e-2d2e35f5-4c47 e-paragraph-base">WesterMedia</p>
            <span class="e-66d98007-6384 e-paragraph-base"
              ><a href="#" class="e-paragraph-link-base"> Work </a></span
            >
            <span class="e-7702ba60-a082 e-paragraph-base"
              ><a href="#" class="e-paragraph-link-base"> About </a></span
            >
            <span class="e-50f3edfe-5467 e-paragraph-base"
              ><a href="#" class="e-paragraph-link-base"> Contact </a></span
            >
            <span class="e-241b7cc0-611d e-paragraph-base"
              ><a href="#" class="e-paragraph-link-base"> Humboldt &amp; Fort Dodge </a></span
            >
          </div>
          <div class="elementor-element e-con e-flexbox-base e-6e414c5c-346e">
            <p class="e-3a2ca0f7-27f0 e-paragraph-base">Get in touch</p>
            <span class="e-15f9d089-8319 e-paragraph-base"
              ><a href="#" class="e-paragraph-link-base">
                {{ contact.email || "websites@wester.media" }}
              </a></span
            >
            <span class="e-798f1616-10b1 e-paragraph-base">{{
              (contact.locations || []).join(" · ") || "Humboldt, Iowa"
            }}</span>
            <span class="e-465b9542-b4e0 e-paragraph-base"
              ><a href="#" class="e-paragraph-link-base"> Facebook &#x2192; </a></span
            >
          </div>
        </div>

        <hr class="e-54e29bc6-b1ff e-divider-base" />
        <div class="elementor-element e-con e-flexbox-base e-2c17c4e4-c186">
          <p class="e-d8b720d-a30b e-paragraph-base">&#xA9; 2026 WesterMedia. All rights reserved.</p>
          <p class="e-3a4ae98f-5c64 e-paragraph-base"
            >Designed, written and built in Humboldt, Iowa &#x273A;</p
          >
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "HomeFooter",
  data: () => ({ contact: (window.APP_CONFIG && window.APP_CONFIG.contact) || {} }),
};
</script>
