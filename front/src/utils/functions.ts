import { JsonObject } from "./types";
import moment from "moment";

export const generateRandomString = (
  length: number,
  duplicate = true,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
) => {
  if (!duplicate) {
    if (length > characters.length)
      throw new Error(
        "Length must be less than or equal characters length to avoid duplicate characters"
      );
    for (const char of characters) {
      if (characters.split(char).length - 1 > 1)
        throw new Error(
          "Characters must be unique to avoid duplicate characters"
        );
    }
  }
  let result = "";
  const charactersLength = characters.length;
  for (let index = 0; index < length; index++) {
    let char = characters.charAt(Math.floor(Math.random() * charactersLength));
    if (!duplicate) {
      while (result.includes(char)) {
        char = characters.charAt(Math.floor(Math.random() * charactersLength));
      }
    }
    result += char;
  }
  return result;
};

export function groupByHour(
  data: {
    x: Date;
    y: number;
  }[]
) {
  const result: {
    x: Date;
    y: number;
  }[] = [];
  data.forEach((item) => {
    const last = result[result.length - 1];
    const date: Date = new Date(item.x);
    date.setMinutes(0, 0, 0);
    if (!last || new Date(last.x).getTime() !== date.getTime()) {
      result.push({
        x: moment(date).toDate(),
        y: item.y,
      });
    }
    if (last && new Date(last.x).getTime() === date.getTime()) {
      last.y = item.y;
    }
  });
  return result;
}

export function groupByDay(
  data: {
    x: Date;
    y: number;
  }[]
) {
  const result: {
    x: Date;
    y: number;
  }[] = [];
  data.forEach((item) => {
    const last = result[result.length - 1];
    const date: Date = new Date(item.x);
    date.setHours(0, 0, 0, 0);
    
    if (!last || new Date(last.x).getTime() !== date.getTime()) {
      result.push({
        x: date,
        y: item.y,
      });
    }
    if (last && new Date(last.x).getTime() === date.getTime()) {
      last.y += item.y;
    }
  });
  return result;
}

export function groupByWeek(
  data: {
    x: Date;
    y: number;
  }[]
) {
  const result: {
    x: Date;
    y: number;
  }[] = [];
  data.forEach((item) => {
    const last = result[result.length - 1];
    const date: Date = new Date(item.x);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - date.getDay());
    if (!last || new Date(last.x).getTime() !== date.getTime()) {
      result.push({
        x: date,
        y: item.y,
      });
    }
    if (last && new Date(last.x).getTime() === date.getTime()) {
      last.y += item.y;
    }
  });
  return result;
}

export const flatten = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any,
  parentKey = "",
  res: JsonObject = {},
  sep: string = "."
) => {
  for (const key in obj) {
    const propName = parentKey ? `${parentKey}${sep}${key}` : key;
    if (typeof obj[key] === "object") {
      res[propName] = obj[key];
      flatten(obj?.[key], propName, res, sep);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
};
