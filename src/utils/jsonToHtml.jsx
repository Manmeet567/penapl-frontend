function escapeHtml(html) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(html));
  return div.innerHTML;
}

function convertJsonToHtml(editorJSData) {
  let html = '';

  editorJSData.blocks.forEach((block) => {
    html += `<div class="block" data-id="${block.id}" data-type="${block.type}">`;

    switch (block.type) {
      case 'header':
        const headerTag = `h${block.data.level}`;
        const fontSize = (block.data.level === 1 ? 2.5 : (2.5 - block.data.level * 0.3)) + 'rem';
        html += `<${headerTag} style="font-size: ${fontSize}">${block.data.text}</${headerTag}>`;
        break;

      case 'paragraph':
        html += `<p style="font-size:21px; line-height:1.5; text-align:justify; margin:20px 0">${block.data.text}</p>`;
        break;
      case 'image':
        html += `<figure style="margin:20px 0"><img src="${block.data.url}" alt="${block.data.caption}" style="height:100%; width:100%;" /><figcaption style="text-align:center;">${block.data.caption}<figcaption /><figure />`;
        break;
      case 'quote':
        html += `<div style="margin:40px 0"><blockquote class="quote">${block.data.text}</blockquote><cite class="quote-caption">${block.data.caption}</cite></div>`;
        break;
      case 'code':
        html += `<div style="margin:20px 0; padding:20px; background-color:#ddd; max-height:400px; overflow:auto; text-align:left"><pre><code class="code-block">${escapeHtml(block.data.code)}</code></pre></div>`;
        break;
      case 'list':
        const listTag = block.data.style === 'ordered' ? 'ol' : 'ul';
        html += `<${listTag} style="margin:20px 0; font-size:21px; text-align:left">`;
        block.data.items.forEach((item) => {
          html += `<li style="margin:10px 0">${item}</li>`;
        });
        html += `</${listTag}>`;
        break;
      case 'delimiter':
        html += '<hr style="margin:20px 0" />';
        break;
      default:
        break;
    }

    html += '</div>';
  });

  return html;
}


export {convertJsonToHtml}