<template>
  <div
    class="_tooltip"
    :style="{
      display: this.inline ? 'inline-flex' : 'flex',
    }"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <div class="flex-container" :style="flexContainerStyle">
      <!-- main content goes here -->
      <slot></slot>
      <div
        class="nosize-container"
        v-if="$slots.message && hovering"
        :style="nosizeContainerStyle"
      >
        <div class="message-max-sizer" :style="messageMaxSizerStyle">
          <div class="message-container" :style="messageContainerStyle">
            <!-- tooltip content goes here -->
            <slot name="message"></slot>
          </div>
        </div>
        <div class="hover-triangle" :style="triangleStyle">
          <div class="hover-triangle-inset" :style="insetTriangleStyle"></div>
        </div>
        <div class="spacer" :style="spacerStyle"></div>
      </div>
    </div>
  </div>
</template>

<script>
const HORIZONTAL_GRAVITIES = ["left", "center", "right"];
const VERTICAL_GRAVITIES = ["top", "center", "bottom"];

const MARGIN_TO_TARGET = 3;
const ARROW_RISE = 7;
const ARROW_BASE = 14;
const ARROW_FILL = "#3e3e3e";
const ARROW_INSET_FILL = "#202020";

export default {
  props: {
    /**
     * Where the tooltip appears relative to the original object.
     * Format: `<horizontal> <vertical>`
     * e.g. `left center`
     * Horizontal options: `left`, `center`, `right`
     * Vertical optioins: `top`, `center`, `bottom`
     */
    gravity: {
      type: String,
      required: false,
      default: "center bottom",
      validator: function (value) {
        let pieces = splitGravString(value);
        if (!HORIZONTAL_GRAVITIES.includes(pieces[0])) {
          return false;
        }
        if (pieces[1] && !VERTICAL_GRAVITIES.includes(pieces[1])) {
          return false;
        }
        return true;
      },
    },

    inline: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  data: function () {
    return {
      hovering: false,
    };
  },

  computed: {
    horizontalGravity() {
      let hgrav = splitGravString(this.gravity)[0];
      if (!HORIZONTAL_GRAVITIES.includes(hgrav)) {
        hgrav = "center";
      }
      return hgrav;
    },

    verticalGravity() {
      let vgrav = splitGravString(this.gravity)[1] || "center";
      if (!VERTICAL_GRAVITIES.includes(vgrav)) {
        vgrav = "center";
      }
      if (this.horizontalGravity == "center" && vgrav == "center") {
        vgrav = "bottom";
      }

      return vgrav;
    },

    flexContainerStyle() {
      let style = {};

      switch (this.horizontalGravity) {
        case "left":
          style["flex-direction"] = "row-reverse";
          // style['justify-content'] = 'flex-end';
          break;
        case "right":
          style["flex-direction"] = "row";
          // style['justify-content'] = 'flex-start';
          break;
        case "center":
          switch (this.verticalGravity) {
            case "top":
              style["flex-direction"] = "column-reverse";
              break;
            case "bottom":
              style["flex-direction"] = "column";
              break;
          }
          break;
      }

      return style;
    },

    nosizeContainerStyle() {
      let style = {};

      if (this.horizontalGravity == "center") {
        style["align-items"] = "center";
        switch (this.verticalGravity) {
          case "top":
            style["flex-direction"] = "column";
            break;
          case "bottom":
            style["flex-direction"] = "column-reverse";
            break;
        }
        switch (this.verticalGravity) {
          case "top":
            break;
          case "bottom":
            break;
        }
      } else {
        switch (this.horizontalGravity) {
          case "left":
            style["flex-direction"] = "row";
            break;
          case "right":
            style["flex-direction"] = "row-reverse";
            break;
        }
        switch (this.verticalGravity) {
          case "top":
            style["align-items"] = "flex-end";
            break;
          case "bottom":
            style["align-items"] = "flex-start";
            break;
          case "center":
            style["align-items"] = "center";
            break;
        }
      }

      return style;
    },

    spacerStyle() {
      let style = {};
      let marginStr = MARGIN_TO_TARGET + "px";
      switch (this.triangleDirection) {
        case "left":
        case "right":
          style["width"] = marginStr;
          style["height"] = `${ARROW_BASE}px`;
          break;
        case "up":
        case "down":
          style["width"] = `${ARROW_BASE}px`;
          style["height"] = marginStr;
          break;
      }
      return style;
    },

    triangleStyle() {
      let style = this.getTriangleStyle(ARROW_FILL, ARROW_BASE, ARROW_RISE);

      if (this.horizontalGravity != "center") {
        switch (this.verticalGravity) {
          case "top":
            style["top"] = `${ARROW_BASE / 2}px`;
            break;
          case "bottom":
            style["top"] = `-${ARROW_BASE / 2}px`;
            break;
        }
      }

      return style;
    },

    insetTriangleStyle() {
      let style = this.getTriangleStyle(
        ARROW_INSET_FILL,
        ARROW_BASE,
        ARROW_RISE
      );

      let left, top;
      if (this.horizontalGravity == "center") {
        style["left"] = `-${ARROW_BASE / 2}px`;
        style[this.verticalGravity] = `-${ARROW_RISE + 2}px`;
      } else {
        style["top"] = `-${ARROW_BASE / 2}px`;
        style[this.horizontalGravity] = `-${ARROW_RISE + 2}px`;
      }

      return style;
    },

    messageMaxSizerStyle() {
      let style = {};

      switch (this.horizontalGravity) {
        case "left":
          style["text-align"] = "right";
          break;
        case "center":
          style["text-align"] = "center";
          break;
        case "right":
          style["text-align"] = "left";
          break;
      }

      return style;
    },

    messageContainerStyle() {
      let style = {};

      if (this.horizontalGravity != "center") {
        switch (this.verticalGravity) {
          case "top":
            style.top = "13px";
            break;
          case "bottom":
            style.top = "-13px";
            break;
          case "center":
            break;
        }
      }

      return style;
    },

    triangleDirection() {
      switch (this.horizontalGravity) {
        case "center":
          switch (this.verticalGravity) {
            case "top":
              return "down";
            case "bottom":
              return "up";
          }
          break;
        case "left":
          return "right";
        case "right":
          return "left";
      }
      return null;
    },
  },

  methods: {
    getTriangleStyle: function (color, base, rise) {
      let style = {};

      const solidBorder = `${rise}px solid ${color}`;
      const transBorder = `${base / 2}px solid transparent`;

      if (this.horizontalGravity == "center") {
        style["border-left"] = transBorder;
        style["border-right"] = transBorder;
        switch (this.verticalGravity) {
          case "top":
            style["border-top"] = solidBorder;
            break;
          case "bottom":
            style["border-bottom"] = solidBorder;
            break;
        }
      } else {
        style["border-top"] = transBorder;
        style["border-bottom"] = transBorder;
        switch (this.horizontalGravity) {
          case "left":
            style["border-left"] = solidBorder;
            break;
          case "right":
            style["border-right"] = solidBorder;
            break;
        }
      }

      return style;
    },
  },
};

function splitGravString(str) {
  return str.trim().split(/\s+/);
}
</script>

<style scoped>
.flex-container {
  position: relative;
  align-items: center;
  display: inline-flex;
}

.nosize-container {
  display: flex;
  width: 0;
  height: 0;
  position: relative;
  justify-content: flex-end;
  z-index: 99;
}

.spacer {
  flex: 0 0 auto;
}

.hover-triangle {
  width: 0;
  height: 0;
  position: relative;
  flex: 0 0 auto;
}

.hover-triangle-inset {
  width: 0;
  height: 0;
  position: absolute;
}

.message-max-sizer {
  width: 250px;
  text-align: center;
  flex: 0 0 auto;
}

.message-container {
  display: inline-block;
  padding: 7px 8px;
  max-width: 250px;
  box-sizing: border-box;
  background: #202020;
  border: 1px solid #3e3e3e;
  position: relative;

  color: #a7a29c;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.25;
  text-align: left;
  white-space: initial;

  box-shadow: 0 0px 10px rgba(0, 0, 0, 0.3);
}
</style>
