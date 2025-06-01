import { z } from "zod";
import {
  RequiredUrl,
  NullableDate,
  RequiredString,
  NullableString,
  RequiredNumber,
  NullableSic,
} from "./generics";

export const RawRecord = z.object({
  CompanyName: RequiredString,
  CompanyNumber: RequiredString,
  "RegAddress.CareOf": NullableString,
  "RegAddress.POBox": NullableString,
  "RegAddress.AddressLine1": NullableString,
  "RegAddress.AddressLine2": NullableString,
  "RegAddress.PostTown": NullableString,
  "RegAddress.County": NullableString,
  "RegAddress.Country": NullableString,
  "RegAddress.PostCode": NullableString,
  CompanyCategory: RequiredString,
  CompanyStatus: RequiredString,
  CountryOfOrigin: NullableString,
  DissolutionDate: NullableDate,
  IncorporationDate: NullableDate,
  "Accounts.AccountRefDay": RequiredNumber,
  "Accounts.AccountRefMonth": RequiredNumber,
  "Accounts.NextDueDate": NullableDate,
  "Accounts.LastMadeUpDate": NullableDate,
  "Accounts.AccountCategory": RequiredString,
  "Returns.NextDueDate": NullableDate,
  "Returns.LastMadeUpDate": NullableDate,
  "Mortgages.NumMortCharges": RequiredNumber,
  "Mortgages.NumMortOutstanding": RequiredNumber,
  "Mortgages.NumMortPartSatisfied": RequiredNumber,
  "Mortgages.NumMortSatisfied": RequiredNumber,
  "SICCode.SicText_1": NullableSic,
  "SICCode.SicText_2": NullableSic,
  "SICCode.SicText_3": NullableSic,
  "SICCode.SicText_4": NullableSic,
  "LimitedPartnerships.NumGenPartners": RequiredNumber,
  "LimitedPartnerships.NumLimPartners": RequiredNumber,
  URI: RequiredUrl,
  //   "PreviousName_1.CONDATE": z.string(),
  //   "PreviousName_1.CompanyName": z.string(),
  //   "PreviousName_2.CONDATE": z.string(),
  //   "PreviousName_2.CompanyName": z.string(),
  //   "PreviousName_3.CONDATE": z.string(),
  //   "PreviousName_3.CompanyName": z.string(),
  //   "PreviousName_4.CONDATE": z.string(),
  //   "PreviousName_4.CompanyName": z.string(),
  //   "PreviousName_5.CONDATE": z.string(),
  //   "PreviousName_5.CompanyName": z.string(),
  //   "PreviousName_6.CONDATE": z.string(),
  //   "PreviousName_6.CompanyName": z.string(),
  //   "PreviousName_7.CONDATE": z.string(),
  //   "PreviousName_7.CompanyName": z.string(),
  //   "PreviousName_8.CONDATE": z.string(),
  //   "PreviousName_8.CompanyName": z.string(),
  //   "PreviousName_9.CONDATE": z.string(),
  //   "PreviousName_9.CompanyName": z.string(),
  //   "PreviousName_10.CONDATE": z.string(),
  //   "PreviousName_10.CompanyName": z.string(),
  ConfStmtNextDueDate: NullableDate,
  ConfStmtLastMadeUpDate: NullableDate,
});

export const Record = RawRecord.transform((rec) => {
  const sic = [
    rec["SICCode.SicText_1"],
    rec["SICCode.SicText_2"],
    rec["SICCode.SicText_3"],
    rec["SICCode.SicText_4"],
  ].filter((sic) => !!sic);
  const limitedPartnerships =
    rec["LimitedPartnerships.NumGenPartners"] ||
    rec["LimitedPartnerships.NumLimPartners"]
      ? {
          nGeneralPartners: rec["LimitedPartnerships.NumGenPartners"],
          nLimitedPartners: rec["LimitedPartnerships.NumLimPartners"],
        }
      : null;
  return {
    name: rec.CompanyName,
    number: rec.CompanyNumber,
    status: rec.CompanyStatus,
    category: rec.CompanyCategory,
    sicCodes: sic,
    url: rec.URI,
    incorporationDate: rec.IncorporationDate,
    dissolutionDate: rec.DissolutionDate,
    countryOfOrigin: rec.CountryOfOrigin,
    registeredAddress: {
      careOf: rec["RegAddress.CareOf"],
      poBox: rec["RegAddress.POBox"],
      addressLine1: rec["RegAddress.AddressLine1"],
      addressLine2: rec["RegAddress.AddressLine2"],
      postalTown: rec["RegAddress.PostTown"],
      county: rec["RegAddress.County"],
      country: rec["RegAddress.Country"],
      postalCode: rec["RegAddress.PostCode"],
    },
    limitedPartnerships,
    accounts: {
      category: rec["Accounts.AccountCategory"],
      nextDueDate: rec["Accounts.NextDueDate"],
      lastMadeUpDate: rec["Accounts.LastMadeUpDate"],
    },
    taxReturns: {
      nextDueDate: rec["Returns.NextDueDate"],
      lastMadeUpDate: rec["Returns.LastMadeUpDate"],
    },
    mortgages: {
      nCharges: rec["Mortgages.NumMortCharges"],
      nOutstanding: rec["Mortgages.NumMortOutstanding"],
      nPartSatisfied: rec["Mortgages.NumMortPartSatisfied"],
      nSatisfied: rec["Mortgages.NumMortSatisfied"],
    },
    confirmationStatement: {
      nextDueDate: rec["ConfStmtNextDueDate"],
      lastMadeUpDate: rec["ConfStmtLastMadeUpDate"],
    },
  };
});

export type Record = z.infer<typeof Record>;
