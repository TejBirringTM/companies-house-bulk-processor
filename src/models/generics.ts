import { parse as parseDate } from "date-fns";
import { z } from "zod";

export const NullableDate = z.string().transform((str) => {
  if (!str) {
    return null;
  } else {
    return parseDate(str, "dd/MM/yyyy", new Date());
  }
});

export const NullableString = z.string().transform((str) => {
  if (!str) {
    return null;
  } else {
    return str;
  }
});

export const RequiredString = z.string().nonempty();

export const RequiredUrl = z.string().url();

export const RequiredNumber = z.preprocess((val) => {
  // extra step for normalisation of strange values in CSV file
  if (typeof val === "boolean") {
    return 0;
  } else {
    return val;
  }
}, z.coerce.number().nonnegative());

const SicRegex = RegExp(/^([0-9]+)\s+\-\s+(.+)/);
export const NullableSic = z.string().transform((str) => {
  if (!str) {
    return null;
  } else {
    const matches = SicRegex.exec(str);
    const code = matches?.[1] || null;
    const description = matches?.[2]?.trim() || null;
    return code
      ? {
          code,
          description,
        }
      : null;
  }
});
