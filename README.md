# signdo-sdk

Embeddable e-signature widget for [Signdo](https://signdo.swappscloud.com). This repo distributes only the built browser bundle — the source lives in Signdo's private monorepo and is auto-published here on every relevant change.

## Usage

```html
<div id="signature" style="width: 400px; height: 150px"></div>

<script src="https://cdn.jsdelivr.net/gh/swappcloud/signdo-sdk@latest/signdo.min.js"></script>
<script>
  Signdo.init({ publicKey: 'pk_...', applicationId: '...' });

  Signdo.createSignatureField({ element: '#signature', width: 400, height: 150 })
    .on('completed', (signature) => {
      // Send signature.signatureHash to your server and verify it there
      // with your secret key. The browser saying "done" is not proof.
      console.log(signature.signatureHash);
    });
</script>
```

Only ever put a publishable key (`pk_...`) in browser code. A secret key (`sk_...`) belongs on your server only.

An ES module build is also published as `signdo.esm.js` for bundler-based integrations.

## Publishing

This repo has no history of its own commits worth reading — every push here is generated. Nothing is hand-edited; changes come from the private monorepo's build pipeline.
