module.exports = {
  mode: 'jit',
  plugin: [
    require('@tailwindcss/line-clamp'),
  ],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
  ],
  variants: {
    opacity: ['responsive', 'hover', 'focus', 'group-hover', 'group-focus'],
    extend: {
      margin: ["last"]
    }
  },
  theme: {
    groupLevel: 10,
    // will result in as many direct child selectors as defined here
    groupScope: "scope",
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      colors: {
        divider: "var(--color-divider)",
        primary: "var(--color-primary)",
        "green-0": "var(--color-green-0)",
        header: {
          primary: "var(--color-header-primary)",
          secondary: "var(--color-header-secondary)",
        },
        text: {
          normal: "var(--color-text-normal)",
          muted: "var(--color-text-muted)",
        },
        input: {
          background: "var(--color-input-background)"
        },
        background: {
          primary: "var(--color-background-primary)",
          secondary: "var(--color-background-secondary)",
          "secondary-alt": "var(--color-background-secondary-alt)",
          tertiary: "var(--color-background-tertiary)",
          accent: "var(--color-background-accent)",
          floating: "var(--color-background-floating)",
          "nested-floating": "var(--color-background-nested-floating)",
          modifier: {
            normal: "var(--color-background-modifier)",
            hover: "var(--color-background-modifier-hover)",
            active: "var(--color-background-modifier-active)",
            selected: "var(--color-background-modifier-selected)",
          }
        },
        button: {
          text: {
            disabled: "var(--color-button-text-disabled)",
          },
          primary: {
            normal: "var(--color-button-primary-normal)",
            hover: "var(--color-button-primary-hover)",
            active: "var(--color-button-primary-active)",
            disabled: "var(--color-button-primary-disabled)",
          },
          secondary: {
            normal: "var(--color-button-secondary-normal)",
            hover: "var(--color-button-secondary-hover)",
            active: "var(--color-button-secondary-active)",
            disabled: "var(--color-button-secondary-disabled)",
          },
          danger: {
            normal: "var(--color-button-danger-normal)",
            hover: "var(--color-button-danger-hover)",
            active: "var(--color-button-danger-active)",
            disabled: "var(--color-button-danger-disabled)",
          },
          success: {
            normal: "var(--color-button-success-normal)",
            hover: "var(--color-button-success-hover)",
            active: "var(--color-button-success-active)",
            disabled: "var(--color-button-success-disabled)",
          }
        },
        channels: {
          default: "var(--color-channels-default)",
          active: "",
        },
        interactive: {
          normal: "var(--color-interactive-normal)",
          hover: "var(--color-interactive-hover)",
          active: "var(--color-interactive-active)",
          muted: "var(--color-interactive-muted)",
        },
        status: {
          online: "var(--color-status-online)",
          idle: "var(--color-status-idle)",
          dnd: "var(--color-status-dnd)",
          offline: "var(--color-status-offline)",
        },
        "channeltextarea-background": "var(--color-channeltextarea-background)",
      },
    },
  }
}