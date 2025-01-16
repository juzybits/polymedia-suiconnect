# ShopiSui - Shopify wallet connector for Sui

## Installation

Add this "Custom liquid" to your Shopify theme:

```html
<div id="shopisui-root"></div>

<script>
(function()
{
    // Handle wallet connect/disconnect
    function onWalletChange(event) {
        const { client, address } = event.detail;
        console.log("Wallet status changed:", { client, address });
    }

    // Load ShopiSui CSS
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = "https://shopisui.polymedia.app/assets/index-B_JEpp2Z.css";
    document.head.appendChild(cssLink);

    // Load and initialize ShopiSui JS
    const script = document.createElement("script");
    script.src = "https://shopisui.polymedia.app/assets/index-BI6mWmzs.js";
    script.onload = function() {
        window.shopisuiInit();
        window.addEventListener("shopisui-wallet-change", onWalletChange);
    };
    document.body.appendChild(script);
})();
</script>
```
