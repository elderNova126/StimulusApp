// @ts-ignore
import iso3166 from 'iso-3166-2';
// @ts-ignore
import iso3311a2 from 'iso-3166-1-alpha-2';
import { useEffect, useState } from 'react';

export const useGetCountries = (Search: string) => {
  const subDivisionPlaceholder = 'Subdivision codes';
  const countryPlaceholder = 'Country codes';
  const handleIsoCodeResult = () => {
    if (!Search || Search.length > 2) return [];
    const infoCountry = iso3166.country(Search);
    const sub = infoCountry?.sub ?? {};
    const filteredSub: any = {};
    for (const key in sub) {
      if (sub[key].type !== 'Country') {
        filteredSub[key] = sub[key];
      }
    }

    const keys = Object.keys(filteredSub);
    let keysWithoutContry = keys.map((key) => key.replace(`${Search.toUpperCase()}-`, ''));
    keysWithoutContry = keysWithoutContry?.sort();

    return keysWithoutContry?.length > 0 ? [subDivisionPlaceholder, ...keysWithoutContry] : [];
  };

  let listOfCountries = iso3311a2.getCodes();
  listOfCountries = listOfCountries?.sort();
  listOfCountries = [countryPlaceholder, ...listOfCountries];
  const [country, setCountries] = useState(handleIsoCodeResult());

  useEffect(() => {
    setCountries(handleIsoCodeResult());
  }, [Search]); // eslint-disable-line react-hooks/exhaustive-deps

  return { listOfCountries, country: country ?? [] };
};
