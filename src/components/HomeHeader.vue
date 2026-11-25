<template>
<header class="et-l et-l--header">
      <div class="et_builder_inner_content et_pb_gutters3">
    <div class="et_pb_section et_pb_section_0_tb_header et_pb_with_background et_section_regular">
        <div class="et_pb_row et_pb_row_0_tb_header">
        <div class="et_pb_column et_pb_column_4_4 et_pb_column_0_tb_header et_pb_css_mix_blend_mode_passthrough et-last-child dd-has-divimenu">
        <div style="" class="et_pb_with_border et_pb_module et_pb_divimenus_flex et_pb_divimenus_flex_0_tb_header et_had_animation">
        <div class="et_pb_module_inner">
          <div class="dd-wrapper"><div class="dd-logo"><a href="#"><img fetchpriority="high" decoding="async" width="1630" height="400" alt="" src="psgmedia/assets/PSG-Media_Logo-White.png" class="wp-image-30397"></a></div><nav role="menu" aria-label="DiviMenu" class="dd-divimenu dd-flex dd-divimenu-open"><div role="menuitem" class="dd-menu-button"><span role="button" aria-pressed="true" tabindex="0" class="dd-item dd-menu-button-content dd-icon-content notranslate" @click="menuOpen = !menuOpen" @keydown.enter.prevent="menuOpen = !menuOpen" @keydown.space.prevent="menuOpen = !menuOpen" :aria-expanded="String(menuOpen)" data-local-action="" aria-label="Toggle navigation">a</span></div><div role="menuitem" class="et_pb_divimenus_flex_item et_pb_divimenus_flex_item_0_tb_header">
        <div class="et_pb_module_inner">
          <div class="dd-mi-w dd-menu-flex-item-wrapper"><div class="dd-mi dd-menu-flex-item dd-active-url "><a href="#"><div tabindex="0" class="dd-item dd-menu-item-content dd-text"><div class="dd-text-image"><img decoding="async" src="data:," class="" alt="" aria-label="Image"></div><span class="dd-text-content">About</span></div></a></div></div>
        </div>
      </div><div role="menuitem" class="et_pb_divimenus_flex_item et_pb_divimenus_flex_item_1_tb_header">
        <div class="et_pb_module_inner">
          <div class="dd-mi-w dd-menu-flex-item-wrapper"><div class="dd-mi dd-menu-flex-item dd-active-url dd-h-d dd-h-t dd-h-p " @mouseenter="servicesOpen = true" @mouseleave="servicesOpen = false" @focusin="servicesOpen = true" @focusout="closeServices"><a aria-haspopup="true"  class="dd-sub dd-open-url" href="#" :aria-expanded="String(servicesOpen)"><div tabindex="0" class="dd-item dd-menu-item-content dd-text"><span aria-label="3 Icon Font" data-desktop="3" data-hover="2" class="dd-text-icon dd-icon-content notranslate dd-multi-value">{{ servicesOpen ? '2' : '3' }}</span><span class="dd-text-content">Our Services</span></div></a><div class="dd-menu-flex-sub" :class="{ 'psg-services-open': servicesOpen }"><div class="et_pb_with_border et_pb_section et_pb_section_1_tb_header et_pb_with_background et_section_regular">
        <div class="et_pb_row et_pb_row_1_tb_header">
        <div class="et_pb_column et_pb_column_1_2 et_pb_column_1_tb_header et_pb_css_mix_blend_mode_passthrough">
        <div class="et_pb_with_border et_pb_module et_pb_blurb et_pb_blurb_0_tb_header et_pb_section_video_on_hover et_pb_text_align_left et_pb_blurb_position_left et_pb_bg_layout_light">
        <div class="et_pb_blurb_content">
          <div class="et_pb_main_blurb_image"><a href="#"><span class="et_pb_image_wrap et_pb_only_image_mode_wrap"><img decoding="async" width="25" height="23" alt="" src="psgmedia/assets/web-design.svg" class="et-waypoint et_pb_animation_off et_pb_animation_off_tablet et_pb_animation_off_phone wp-image-243006 et-animated"></span></a></div>
          <div class="et_pb_blurb_container">
            <h4 class="et_pb_module_header"><a href="#">Web Design</a></h4>
          </div>
        </div>
      </div><div class="et_pb_with_border et_pb_module et_pb_blurb et_pb_blurb_1_tb_header et_pb_section_video_on_hover et_pb_text_align_left et_pb_blurb_position_left et_pb_bg_layout_light">
        <div class="et_pb_blurb_content">
          <div class="et_pb_main_blurb_image"><a href="#"><span class="et_pb_image_wrap et_pb_only_image_mode_wrap"><img decoding="async" width="25" height="23" alt="" src="psgmedia/assets/marketing-chart.svg" class="et-waypoint et_pb_animation_off et_pb_animation_off_tablet et_pb_animation_off_phone wp-image-243005 et-animated"></span></a></div>
          <div class="et_pb_blurb_container">
            <h4 class="et_pb_module_header"><a href="#">Digital Marketing</a></h4>
          </div>
        </div>
      </div><div class="et_pb_with_border et_pb_module et_pb_blurb et_pb_blurb_2_tb_header et_pb_section_video_on_hover et_pb_text_align_left et_pb_blurb_position_left et_pb_bg_layout_light">
        <div class="et_pb_blurb_content">
          <div class="et_pb_main_blurb_image"><a href="#"><span class="et_pb_image_wrap et_pb_only_image_mode_wrap"><img decoding="async" width="22" height="21" alt="" src="psgmedia/assets/briefcase.svg" class="et-waypoint et_pb_animation_off et_pb_animation_off_tablet et_pb_animation_off_phone wp-image-243004 et-animated"></span></a></div>
          <div class="et_pb_blurb_container">
            <h4 class="et_pb_module_header"><a href="#">Business Consulting</a></h4>
          </div>
        </div>
      </div>
      </div><div class="et_pb_column et_pb_column_1_2 et_pb_column_2_tb_header et_pb_css_mix_blend_mode_passthrough et-last-child">
        <div class="et_pb_with_border et_pb_module et_pb_blurb et_pb_blurb_3_tb_header et_pb_section_video_on_hover et_pb_text_align_left et_pb_blurb_position_left et_pb_bg_layout_light">
        <div class="et_pb_blurb_content">
          <div class="et_pb_main_blurb_image"><a href="#"><span class="et_pb_image_wrap et_pb_only_image_mode_wrap"><img decoding="async" width="22" height="22" alt="" src="psgmedia/assets/PPC.svg" class="et-waypoint et_pb_animation_off et_pb_animation_off_tablet et_pb_animation_off_phone wp-image-243044 et-animated"></span></a></div>
          <div class="et_pb_blurb_container">
            <h4 class="et_pb_module_header"><a href="#">Pay Per Click</a></h4>
          </div>
        </div>
      </div><div class="et_pb_with_border et_pb_module et_pb_blurb et_pb_blurb_4_tb_header et_pb_section_video_on_hover et_pb_text_align_left et_pb_blurb_position_left et_pb_bg_layout_light">
        <div class="et_pb_blurb_content">
          <div class="et_pb_main_blurb_image"><a href="#"><span class="et_pb_image_wrap et_pb_only_image_mode_wrap"><img decoding="async" width="512" height="512" alt="" src="psgmedia/assets/ai-consulting-icon.png" class="et-waypoint et_pb_animation_off et_pb_animation_off_tablet et_pb_animation_off_phone wp-image-243949 et-animated"></span></a></div>
          <div class="et_pb_blurb_container">
            <h4 class="et_pb_module_header"><a href="#">AI Consulting</a></h4>
          </div>
        </div>
      </div><div class="et_pb_with_border et_pb_module et_pb_blurb et_pb_blurb_5_tb_header et_pb_section_video_on_hover et_pb_text_align_left et_pb_blurb_position_left et_pb_bg_layout_light">
        <div class="et_pb_blurb_content">
          <div class="et_pb_main_blurb_image"><a href="#"><span class="et_pb_image_wrap et_pb_only_image_mode_wrap"><img decoding="async" width="22" height="22" alt="" src="psgmedia/assets/SEO.svg" class="et-waypoint et_pb_animation_off et_pb_animation_off_tablet et_pb_animation_off_phone wp-image-243045 et-animated"></span></a></div>
          <div class="et_pb_blurb_container">
            <h4 class="et_pb_module_header"><a href="#">Search Engine Optimization</a></h4>
          </div>
        </div>
      </div>
      </div>
      </div>
      </div></div></div></div>
        </div>
      </div><div role="menuitem" class="et_pb_divimenus_flex_item et_pb_divimenus_flex_item_2_tb_header">
        <div class="et_pb_module_inner">
          <div class="dd-mi-w dd-menu-flex-item-wrapper"><div class="dd-mi dd-menu-flex-item dd-active-url "><a href="#"><div tabindex="0" class="dd-item dd-menu-item-content dd-text"><span class="dd-text-content">Contact</span></div></a></div></div>
        </div>
      </div><div role="menuitem" class="et_pb_divimenus_flex_item et_pb_divimenus_flex_item_3_tb_header">
        <div class="et_pb_module_inner">
          <div class="dd-mi-w dd-menu-flex-item-wrapper"><div class="dd-mi dd-menu-flex-item dd-active-url "><a href="#"><div tabindex="0" class="dd-item dd-menu-item-content dd-text"><span class="dd-text-content">Blog</span></div></a></div></div>
        </div>
      </div><div role="menuitem" class="et_pb_divimenus_flex_item et_pb_divimenus_flex_item_4_tb_header">
        <div class="et_pb_module_inner">
          <div class="dd-mi-w dd-menu-flex-item-wrapper"><div class="dd-mi dd-menu-flex-item "><a href="#"><div tabindex="0" class="dd-item dd-menu-item-content dd-text"><span aria-label=" Icon Font" class="dd-text-icon dd-icon-content notranslate"></span><span class="dd-text-content">Let's Work Together</span></div></a></div></div>
        </div>
      </div><div role="menuitem" class="et_pb_divimenus_flex_item et_pb_divimenus_flex_item_5_tb_header">
        <div class="et_pb_module_inner">
          <div class="dd-mi-w dd-menu-flex-item-wrapper"><div class="dd-mi dd-menu-flex-item dd-active-url dd-c"><a data-effect-in="slidedown" data-effect-out="slideup" data-effect-ms="147" aria-haspopup="true" data-selector="#menu" class="dd-show dd-show-mb-close dd-toggle dd-keep" href="#" data-local-action="" @click.prevent="menuOpen = !menuOpen" :aria-expanded="String(menuOpen)" aria-label="Toggle navigation" aria-controls="menu"><div tabindex="0" class="dd-item dd-menu-item-content dd-icon"><div class="dd-item-inner"><span aria-label="a Icon Font" data-desktop="a" data-hover="M" class="dd-icon-content notranslate dd-multi-value">{{ menuOpen ? 'M' : 'a' }}</span></div></div></a></div></div>
        </div>
      </div></nav></div>
        </div>
      </div>
      </div>
      </div>
      </div><transition :css="false" @enter="openMenu" @leave="closeMenu"><div id="menu" class="et_pb_section et_pb_section_2_tb_header et_pb_with_background et_section_regular" v-show="menuOpen">
        <div class="et_pb_row et_pb_row_2_tb_header">
        <div class="et_pb_column et_pb_column_4_4 et_pb_column_3_tb_header et_pb_css_mix_blend_mode_passthrough et-last-child">
        <div class="et_pb_module et_pb_blurb et_pb_blurb_6_tb_header et_pb_text_align_left et_pb_blurb_position_left et_pb_bg_layout_light">
        <div class="et_pb_blurb_content">
          <div class="et_pb_main_blurb_image"><a href="#"><span class="et_pb_image_wrap et_pb_only_image_mode_wrap"><img decoding="async" width="24" height="25" alt="" src="psgmedia/assets/circle-info.svg" class="et-waypoint et_pb_animation_top et_pb_animation_top_tablet et_pb_animation_top_phone wp-image-243007 et-animated"></span></a></div>
          <div class="et_pb_blurb_container">
            <h4 class="et_pb_module_header"><a href="#">About</a></h4>
          </div>
        </div>
      </div><div class="et_pb_module et_pb_blurb et_pb_blurb_7_tb_header et_pb_text_align_left et_pb_blurb_position_left et_pb_bg_layout_light">
        <div class="et_pb_blurb_content">
          <div class="et_pb_main_blurb_image"><a href="#"><span class="et_pb_image_wrap et_pb_only_image_mode_wrap"><img decoding="async" width="25" height="23" alt="" src="psgmedia/assets/web-design.svg" class="et-waypoint et_pb_animation_top et_pb_animation_top_tablet et_pb_animation_top_phone wp-image-243006 et-animated"></span></a></div>
          <div class="et_pb_blurb_container">
            <h4 class="et_pb_module_header"><a href="#">Web Design</a></h4>
          </div>
        </div>
      </div><div class="et_pb_module et_pb_blurb et_pb_blurb_8_tb_header et_pb_text_align_left et_pb_blurb_position_left et_pb_bg_layout_light">
        <div class="et_pb_blurb_content">
          <div class="et_pb_main_blurb_image"><a href="#"><span class="et_pb_image_wrap et_pb_only_image_mode_wrap"><img decoding="async" width="25" height="23" alt="" src="psgmedia/assets/marketing-chart.svg" class="et-waypoint et_pb_animation_top et_pb_animation_top_tablet et_pb_animation_top_phone wp-image-243005 et-animated"></span></a></div>
          <div class="et_pb_blurb_container">
            <h4 class="et_pb_module_header"><a href="#">Marketing</a></h4>
          </div>
        </div>
      </div><div class="et_pb_module et_pb_blurb et_pb_blurb_9_tb_header et_pb_text_align_left et_pb_blurb_position_left et_pb_bg_layout_light">
        <div class="et_pb_blurb_content">
          <div class="et_pb_main_blurb_image"><a href="#"><span class="et_pb_image_wrap et_pb_only_image_mode_wrap"><img decoding="async" width="22" height="22" alt="" src="psgmedia/assets/SEO.svg" class="et-waypoint et_pb_animation_top et_pb_animation_top_tablet et_pb_animation_top_phone wp-image-243045 et-animated"></span></a></div>
          <div class="et_pb_blurb_container">
            <h4 class="et_pb_module_header"><a href="#">Search Engine Optimization</a></h4>
          </div>
        </div>
      </div><div class="et_pb_module et_pb_blurb et_pb_blurb_10_tb_header et_pb_text_align_left et_pb_blurb_position_left et_pb_bg_layout_light">
        <div class="et_pb_blurb_content">
          <div class="et_pb_main_blurb_image"><a href="#"><span class="et_pb_image_wrap et_pb_only_image_mode_wrap"><img decoding="async" width="22" height="22" alt="" src="psgmedia/assets/PPC.svg" class="et-waypoint et_pb_animation_top et_pb_animation_top_tablet et_pb_animation_top_phone wp-image-243044 et-animated"></span></a></div>
          <div class="et_pb_blurb_container">
            <h4 class="et_pb_module_header"><a href="#">Pay Per Click</a></h4>
          </div>
        </div>
      </div><div class="et_pb_module et_pb_blurb et_pb_blurb_11_tb_header et_pb_text_align_left et_pb_blurb_position_left et_pb_bg_layout_light">
        <div class="et_pb_blurb_content">
          <div class="et_pb_main_blurb_image"><a href="#"><span class="et_pb_image_wrap et_pb_only_image_mode_wrap"><img decoding="async" width="22" height="21" alt="" src="psgmedia/assets/briefcase.svg" class="et-waypoint et_pb_animation_top et_pb_animation_top_tablet et_pb_animation_top_phone wp-image-243004 et-animated"></span></a></div>
          <div class="et_pb_blurb_container">
            <h4 class="et_pb_module_header"><a href="#">Business Consulting</a></h4>
          </div>
        </div>
      </div><div class="et_pb_module et_pb_blurb et_pb_blurb_12_tb_header et_pb_text_align_left et_pb_blurb_position_left et_pb_bg_layout_light">
        <div class="et_pb_blurb_content">
          <div class="et_pb_main_blurb_image"><a href="#"><span class="et_pb_image_wrap et_pb_only_image_mode_wrap"><img decoding="async" width="22" height="17" alt="" src="psgmedia/assets/envelope.svg" class="et-waypoint et_pb_animation_top et_pb_animation_top_tablet et_pb_animation_top_phone wp-image-243009 et-animated"></span></a></div>
          <div class="et_pb_blurb_container">
            <h4 class="et_pb_module_header"><a href="#">Contact</a></h4>
          </div>
        </div>
      </div><div class="et_pb_module et_pb_blurb et_pb_blurb_13_tb_header et_pb_text_align_left et_pb_blurb_position_left et_pb_bg_layout_light">
        <div class="et_pb_blurb_content">
          <div class="et_pb_main_blurb_image"><a href="#"><span class="et_pb_image_wrap et_pb_only_image_mode_wrap"><img decoding="async" width="22" height="23" alt="" src="psgmedia/assets/blog.svg" class="et-waypoint et_pb_animation_top et_pb_animation_top_tablet et_pb_animation_top_phone wp-image-243046 et-animated"></span></a></div>
          <div class="et_pb_blurb_container">
            <h4 class="et_pb_module_header"><a href="#">Blog</a></h4>
          </div>
        </div>
      </div><div style="" class="et_pb_button_module_wrapper et_pb_button_0_tb_header_wrapper et_pb_button_alignment_center et_pb_module et_had_animation">
        <a data-icon="" class="et_pb_button et_pb_button_0_tb_header et_pb_bg_layout_light" href="#">Let's Work Together</a>
      </div>
      </div>
      </div>
      </div></transition>    </div>
  </header>
</template>

<script>
export default {
  name: "HomeHeader",
  data: () => ({ menuOpen: false, servicesOpen: false }),
  mounted() {
    document.addEventListener("keydown", this.onKeydown);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.onKeydown);
    if (this.menuAnimation) this.menuAnimation.cancel();
  },
  methods: {
    openMenu(element, done) {
      this.animateMenu(element, done, true);
    },
    closeMenu(element, done) {
      this.animateMenu(element, done, false);
    },
    animateMenu(element, done, opening) {
      if (this.menuAnimation) this.menuAnimation.cancel();
      const style = getComputedStyle(element);
      const expanded = {
        height: element.getBoundingClientRect().height + "px",
        paddingTop: style.paddingTop,
        paddingBottom: style.paddingBottom,
      };
      const collapsed = { height: "0px", paddingTop: "0px", paddingBottom: "0px" };
      element.style.overflow = "hidden";
      this.menuAnimation = element.animate(opening ? [collapsed, expanded] : [expanded, collapsed], {
        duration: 147,
        easing: "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
        fill: "both",
      });
      this.menuAnimation.onfinish = () => {
        this.menuAnimation.cancel();
        element.style.overflow = "";
        done();
      };
    },
    onKeydown(event) {
      if (event.key === "Escape") {
        this.menuOpen = false;
        this.servicesOpen = false;
      }
    },
    closeServices(event) {
      if (!event.currentTarget.contains(event.relatedTarget)) this.servicesOpen = false;
    },
  },
};
</script>
