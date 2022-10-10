import _ from "lodash";
import { EMOJI_REGEX, MENTION_REGEX } from "./regex";

const inner = /(?:\\.|[^\\\n\r]|(?:\n|\r\n|(?:[\*~]*)?)(?![\r\n]))/.source;

function createInline(pattern: string) {
  pattern = pattern.replace(/<inner>/g, function () {
    return inner;
  });
  return RegExp(/((?:^|[^\\])(?:\\{2})*)/.source + "(?:" + pattern + ")");
}

const markdownLanguage = {
  blockquote: {
    pattern: /(^|\n)(>) (.*(\n> .*)*)/,
    inside: {
      syntax: {
        pattern: /(?=^|\n)> /gm,
      },
    },
  },
  codeBlock: {
    pattern: createInline(/(```)(?:(?!~)<inner>)+\2/.source),
    lookbehind: true,
    greedy: true,
    inside: {
      syntax: {
        pattern: /```/g,
      },
    },
  },
  inlineCode: {
    // pattern: /((?:^|[^\\])(?:\\{2})*)(?:(`)(?:(?!~)(?:\\.|[^`\\\n\r]|(?:\n|\r\n?)(?![\r\n])))+\2)/,
    pattern: /((`)(?:(?!~)(?:\\.|[^`\\\n\r]|(?:\n|\r\n?)(?![\r\n])))+\2)/g,
    greedy: true,
    inside: {
      syntax: {
        pattern: /`/g,
      },
    },
  },
  bold: {
    pattern: createInline(/\*\*(?:(?!\*)<inner>|\*(?:(?!\*)<inner>)+\*)+\*\*/.source),
    lookbehind: true,
    greedy: true,
    inside: {
      content: {
        pattern: /(^..)[\s\S]+(?=..$)/,
        lookbehind: true,
        inside: {},
      },
      syntax: /\*\*/,
    },
  },
  italic: {
    pattern: createInline(
      /\b_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_\b|\*(?:(?!\*)<inner>|\*\*(?:(?!\*)<inner>)+\*\*)+\*/
        .source
    ),
    lookbehind: true,
    greedy: true,
    inside: {
      content: {
        pattern: /(^.)[\s\S]+(?=.$)/,
        lookbehind: true,
        inside: {},
      },
      syntax: /[*_]/,
    },
  },
  underline: {
    pattern: createInline(/(__)(?:<inner>)+\2/.source),
    lookbehind: true,
    greedy: true,
    inside: {
      content: {
        pattern: /(^__)[\s\S]+(?=\1$)/,
        lookbehind: true,
        inside: {},
      },
      syntax: /__/,
    },
  },
  strike: {
    pattern: createInline(/(~~)(?:<inner>)+\2/.source),
    lookbehind: true,
    greedy: true,
    inside: {
      content: {
        pattern: /(^~~)[\s\S]+(?=\1$)/,
        lookbehind: true,
        inside: {},
      },
      syntax: /~~/,
    },
  },
  spoiler: {
    // pattern:
    //   /((?:^|[^\\])(?:\\{2})*)(?:(\|\|)(?:(?!~)(?:\\.|[^\|\\\n\r]|(?:\n|\r\n?)(?![\r\n])))+\2)/,
    pattern: /((\|\|)(?:(?:\\.|[^\|\\\n\r]|(?:\n|\r\n?)(?![\r\n])))+\2)/g,
    greedy: true,
    inside: {
      content: {
        pattern: /(^\|\|)[\s\S]+(?=\1$)/,
        lookbehind: true,
        inside: {},
      },
      syntax: /\|\|/,
    },
  },
  url: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
  emoji: {
    pattern: EMOJI_REGEX,
    greedy: true,
  },
  mention: {
    pattern: MENTION_REGEX,
  },
};

const nestedTokens: (keyof typeof markdownLanguage)[] = [
  "bold",
  "italic",
  "strike",
  "underline",
  "spoiler",
];

nestedTokens.forEach(function (token) {
  nestedTokens.forEach(function (inside) {
    if (token !== inside) {
      //@ts-ignore
      markdownLanguage[token].inside.content.inside[inside] = markdownLanguage[inside];
    }
  });
});

nestedTokens.forEach(function (token) {
  //@ts-ignore
  markdownLanguage[token].inside.content.inside["inlineCode"] = markdownLanguage["inlineCode"];
  //@ts-ignore
  markdownLanguage[token].inside.content.inside["emoji"] = markdownLanguage["emoji"];
});

_.keys(markdownLanguage).forEach((token) => {
  if (token !== "blockquote") {
    markdownLanguage["blockquote"].inside[token] = markdownLanguage[token];
  }
});

export { markdownLanguage };

export const getTokenSyntax = (token: string) => {
  switch (token) {
    case "bold":
      return "**";
    case "italic":
      return "*";
    case "underline":
      return "__";
    case "strike":
      return "~~";
    case "inlineCode":
      return "`";
    case "spoiler":
      return "||";
    default:
      return "";
  }
};
