<template>
  <svg class="submit-hourglass" viewBox="0 0 356 356" aria-hidden="true">
    <defs>
      <linearGradient id="submit-glass" x1="0" x2="1">
        <stop stop-color="#fff1dc" />
        <stop offset=".25" stop-color="#fff" />
        <stop offset=".75" stop-color="#fffaf0" />
        <stop offset="1" stop-color="#ffdfb9" />
      </linearGradient>
      <linearGradient id="submit-sand" x1="0" y1="0" x2="1" y2=".7">
        <stop stop-color="#ffe2a0" />
        <stop offset=".45" stop-color="#ffbc6b" />
        <stop offset="1" stop-color="#f68d49" />
      </linearGradient>
      <clipPath id="submit-glass-interior">
        <path
          d="M110 86 C105 139 143 158 176 184 Q191 199 176 220 C145 245 108 270 109 305 Q188 325 271 305 C276 270 238 245 207 220 Q191 199 207 184 C239 158 276 139 272 86Z"
        />
      </clipPath>
      <clipPath id="submit-upper-sand">
        <rect class="sand-level" x="100" y="101" width="180" height="100" />
      </clipPath>
      <!-- Keep the supplied caps and clock fixed; animate only the sand inside. -->
      <clipPath id="submit-hourglass-shell">
        <path d="M0 0H356V97H0Z M88 311Q175 319 287 291L309 356H78Z" />
        <path
          d="M137 186C170 210 164 251 141 286C116 325 74 346 41 326C6 312 1 279 16 239C35 190 96 155 137 186Z"
        />
      </clipPath>
    </defs>
    <path
      fill="url(#submit-glass)"
      d="M104 81C96 139 133 159 169 185Q188 201 169 221C135 247 100 271 103 308Q189 333 277 308C281 271 246 247 213 221Q194 201 213 185C249 159 284 139 278 81Z"
    />
    <g clip-path="url(#submit-glass-interior)">
      <g clip-path="url(#submit-upper-sand)">
        <path
          fill="url(#submit-sand)"
          d="M110 107Q188 90 273 107C267 146 235 164 207 184L191 199L176 184C148 164 116 146 110 107Z"
        />
      </g>
      <path class="sand-stream" d="M191 190V309" />
      <path
        class="sand-pile"
        fill="url(#submit-sand)"
        d="M108 310Q143 284 174 246Q190 226 206 246Q237 284 274 310Q190 330 108 310Z"
      />
      <path
        class="glass-highlight"
        d="M263 106Q261 139 229 160M251 263Q264 279 263 298"
      />
    </g>
    <image
      :href="processingArtwork"
      width="356"
      height="356"
      clip-path="url(#submit-hourglass-shell)"
    />
  </svg>
</template>

<script setup>
import processingArtwork from "@/static/amplava/processing.png";
</script>

<style scoped>
.submit-hourglass {
  display: block;
  width: 102px;
  height: 102px;
}
.sand-level {
  animation: sand-drain 3.6s linear infinite;
}
.sand-stream {
  fill: none;
  stroke: #f7ac58;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 3 5;
  animation:
    sand-fall 0.32s linear infinite,
    sand-flow 3.6s linear infinite;
}
.sand-pile {
  transform-origin: 191px 312px;
  animation: sand-fill 3.6s linear infinite;
}
.glass-highlight {
  fill: none;
  stroke: #fff;
  stroke-width: 7;
  stroke-linecap: round;
  opacity: 0.65;
}
@keyframes sand-drain {
  0%,
  5% {
    transform: translateY(0);
  }
  90%,
  100% {
    transform: translateY(99px);
  }
}
@keyframes sand-fill {
  0%,
  5% {
    transform: scale(0.18, 0.04);
  }
  95%,
  100% {
    transform: scale(1);
  }
}
@keyframes sand-fall {
  to {
    stroke-dashoffset: -16;
  }
}
@keyframes sand-flow {
  0%,
  96%,
  100% {
    opacity: 0;
  }
  6%,
  90% {
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .sand-level,
  .sand-stream,
  .sand-pile {
    animation: none;
  }
  .sand-level {
    transform: translateY(38px);
  }
  .sand-pile {
    transform: scale(0.7, 0.4);
  }
}
</style>
