// placeholder tag used in the document to denote where
// the globals should go
const GLOBALS_TAG = '<!-- % GLOBALS % -->';

// placeholder tag used in the document to denote where
// the ssr'd markup should go
const APP_TAG = '<!-- % APP % -->';

// this is a placeholder for the index.html file
// generated during webpack compilation
const document = `<!-- % DOCUMENT % -->`;

export default (app: string, recentPosts: string): string => {
  // client side globals that need to be injected into the document
  const globals = `
  <script type="text/javascript">
    self.APP = {
      recentPosts: JSON.parse('${JSON.stringify(recentPosts)}'),
      posts: new Map(),
      storageUrl: '${process.env.STORAGE_URL}',
      components: {},
      ssr: false,
    };
  </script>
  `;

  return document.replace(GLOBALS_TAG, globals).replace(APP_TAG, app);
};
