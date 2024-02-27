import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Delimiter from "@editorjs/delimiter";
import CodeTool from '@editorjs/code';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import Underline from '@editorjs/underline';
import Quote from '@editorjs/quote';
import InlineImage from 'editorjs-inline-image';

export const EDITOR_JS_TOOLS = {
  header: Header,
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  marker:{
    class:Marker,
    shortcut:'CMD+SHIFT+M'
  },
  inlineCode: {
    class: InlineCode,
    shortcut: 'CMD+SHIFT+M',
  },
  image: {
    class: InlineImage,
    inlineToolbar: true,
    config: {
      embed: {
        display: true,
      },
      unsplash: {
        appName: 'for_blog_app',
        clientId: `${import.meta.env.VITE_UNSPLASH_CLIENT_ID}`
      }
    }
  },
  quote:Quote,  
  underline:Underline, 
  code:CodeTool,
  list: List,
  delimiter: Delimiter
};