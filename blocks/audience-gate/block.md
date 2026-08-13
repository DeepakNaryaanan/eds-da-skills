# Audience Gate

Displays a modal confirmation dialog on page load that requires the visitor to
identify themselves as a US healthcare professional before the page content is
accessible. On confirmation, sets `sessionStorage` so the gate is not shown
again during the same browser session.

Implemented using the native `<dialog>` HTML element.

## Default

| Audience Gate               |
|-----------------------------|
| *(no authored fields)*      |

The default variant uses hard-coded heading ("Are you a US Healthcare
Professional?") and body text. No rows are required. The block reads the
`sessionStorage` key `hcp-confirmed` and suppresses the dialog if found.

## Variations

### Custom

| Audience Gate (custom)      |                                                                                   |
|-----------------------------|-----------------------------------------------------------------------------------|
| Key *(required)*            | Value *(required)*                                                                |
| `heading`                   | Custom dialog heading text (replaces the default "Are you a US Healthcare Professional?") |
| `body`                      | Custom explanatory paragraph rendered inside the dialog before the action buttons |
| `confirm-label`             | Label for the confirm button (defaults to "Yes, I am an HCP") |
| `cancel-label`              | Label for the cancel link (defaults to "No, take me back") |
| `redirect`                  | URL to send the visitor to when they click cancel (defaults to `/`); use `back` to call `history.back()` |

Authored as a configuration block — `readBlockConfig` is used to extract these
key-value pairs. All fields are optional overrides; omitting a field uses the
default value.
