/** Accept HackMD-style language= fences without changing the code itself. */
export default function remarkCodeLanguage() {
  return function transform(tree) {
    function visit(node) {
      if (node.type === 'code' && typeof node.lang === 'string') {
        node.lang = node.lang.trim().replace(/=$/, '').toLowerCase();
      }
      if (Array.isArray(node.children)) node.children.forEach(visit);
    }
    visit(tree);
  };
}
