import _ from "lodash";
import moment from "moment";

export const searchText = (search: string, text: string) =>
  text.toLowerCase().includes(search.toLowerCase());

export const searchArray = (search: string, texts: string[]) =>
  texts.some((text) => searchText(search, text));

export const timestampToString = (timestamp: Date) => {
  if (moment(timestamp).isSame(new Date(), "day")) {
    return `Today at ${moment(timestamp).format("hh:mm A").toString()}`;
  } else {
    return moment(timestamp).format("MM/DD/YYYY").toString();
  }
};

export const isEmptyDeep = (obj: any): boolean => {
  if (_.isObject(obj)) {
    if (_.isEmpty(obj)) return true;
    return _.every(_.map(obj, (v) => isEmptyDeep(v)));
  } else if (_.isString(obj)) {
    return _.isEmpty(obj);
  }
  return false;
};

export function getUrlExtension(url: string): string {
  return url?.split(/[#?]/)?.[0]?.split(".")?.pop()?.trim() ?? "";
}
export function isUrlOnly(string: string) {
  const linkRegex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/;
  const match = string.match(linkRegex);
  return match && match[0] === string;
}
