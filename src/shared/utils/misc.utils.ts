import { get } from 'lodash';
import { inspect } from 'util';
import { v4 as uuid } from 'uuid';

export function paramMapToObject(paramMap: Map<string, any>): object {
  const paramObject: object = {};
  if (paramMap) {
    for (const [key, value] of paramMap) {
      paramObject[key] = value;
    }
  }
  return paramObject;
}

/**
 * arrayToDictionary
 * -------------------
 * Transform an array to a dictionary
 * @param dataArray - array of any type
 * @param dataKey - which key (should be exists in each item of dataArray) will be the key of the response.
 */
export const arrayToDictionary = (dataArray: any[], dataKey: string): { [key: string]: any } => {
  const data = {};
  if (dataArray === undefined) {
    return data;
  }
  if (dataArray.length === 0) {
    return data;
  }
  if (!get(dataArray[0], dataKey)) {
    throw new Error('dataKey is not defined in dataArray');
  }

  dataArray.forEach((item: any) => {
    const key = item[dataKey];
    data[key] = item;
  });

  return data;
};

/**
 * Delay running code by awaiting this function
 * Usage: await asyncTimeout(1000); // delay code for 1sec
 * @param time
 */
export function asyncTimeout(time: number) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => resolve(), time);
  });
}

export function convertBytesToMegaBits(bytes: number): number {
  return bytes / 125000;
}

export function deepInspect(item: unknown, depth: number = null): string {
  return inspect(item, {
    showHidden: false,
    depth: depth,
    colors: true,
  });
}

export function parseBooleanFromStringValue(val: string): boolean {
  switch (val) {
    case 'true':
    case 'TRUE':
    case 'True':
    case 't':
    case 'T':
    case '1': {
      return true;
    }
    default: {
      return false;
    }
  }
}

export function uuidV4(): string {
  return uuid();
}

export function getRandomEnumValue<T>(enumObj: T): T[keyof T] {
  const enumValues = Object.values(enumObj);
  const i = Math.floor(Math.random() * enumValues.length);
  return enumValues[i];
}

/**
 * Recursively flatten an object, with property names that reflect the flattened hierarchy
 * @param obj the object to flatten
 * @param roots keeps previous parent properties as they will be added as a prefix for each prop.
 * @param separator is just a preference if you want to separate nested paths other than dot.
 */
export function flattenObject<T>(obj: T, roots = [], separator = '.'): T {
  return (
    Object
      // find props of given object
      .keys(obj)
      // return an object by iterating props
      .reduce(
        (memo, prop) =>
          Object.assign(
            // create a new object
            {},
            // include previously returned object
            memo,
            Object.prototype.toString.call(obj[prop]) === '[object Object]'
              ? // keep working if value is an object
                flattenObject(obj[prop], roots.concat([prop]), separator)
              : // include current prop and value and prefix prop with the roots
                { [roots.concat([prop]).join(separator)]: obj[prop] },
          ),
        {},
      )
  );
}

export function isEmptyArray(arr: any[]): boolean {
  return !arr || arr.length == 0;
}

export function isEmptyObject(obj: object): boolean {
  return !obj || Object.keys(obj).length === 0;
}

export function isString(myVar: any): boolean {
  return typeof myVar === 'string' || myVar instanceof String;
}

export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

export function hoursToMinutes(hours: number): number {
  return hours * 60;
}
