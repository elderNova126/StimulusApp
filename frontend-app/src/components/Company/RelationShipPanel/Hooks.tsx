import { ProjectCompanyType } from '../company.types';

interface DataParsedObj {
  name: string;
  value: any;
  fill: string;
  opacity: string;
}
export const useMouldDataForPieChart = (dataChart?: ProjectCompanyType) => {
  if (!dataChart) {
    return {
      COLORS: [],
      data: [],
      maxType: {
        name: '',
        value: 0,
        fill: '',
        opacity: 0,
      },
      relationShipsToShow: [],
    };
  }
  //               CONSIDERED AWARDED  SHORTLISTED QUALIFIED   CLIENT
  const COLORS = ['#eb4969', '#12814b', '#7fc1ff', '#ffd18d', '#0085FF'];
  const opacity = [1, 0.5, 0.9, 0.9, 0.5];
  const colorObj = {
    CONSIDERED: { color: COLORS[0], opacity: opacity[0] },
    QUALIFIED: { color: COLORS[3], opacity: opacity[3] },
    SHORTLISTED: { color: COLORS[2], opacity: opacity[2] },
    AWARDED: { color: COLORS[1], opacity: opacity[1] },
    CLIENT: { color: COLORS[4], opacity: opacity[4] },
  } as any;

  const parseData = (data: any) => {
    const dataParsed: DataParsedObj[] = [];
    let max = 0;

    for (const key of Object.keys(data)) {
      if (key === 'companyId') continue;
      dataParsed.push({
        name: key,
        value: data[key],
        fill: colorObj[key]?.color,
        opacity: colorObj[key]?.opacity,
      });

      if (typeof data[key] === 'number') {
        max = Math.max(max, data[key]);
      }
    }
    const dataToGet = [...dataParsed];

    const maxType = dataParsed.sort((a, b) => {
      if (a.name === 'AWARDED' && a.value > 0) return -1;
      if (b.name === 'AWARDED' && b.value > 0) return 1;
      if (a.name === 'SHORTLISTED' && a.value > 0) return -1;
      if (b.name === 'SHORTLISTED' && b.value > 0) return 1;
      if (a.name === 'QUALIFIED' && a.value > 0) return -1;
      if (b.name === 'QUALIFIED' && b.value > 0) return 1;
      if (a.name === 'CONSIDERED' && a.value > 0) return -1;
      if (b.name === 'CONSIDERED' && b.value > 0) return 1;
      if (a.name === 'CLIENT' && a.value > 0) return -1;
      if (b.name === 'CLIENT' && b.value > 0) return 1;
      return 0;
    })[0];

    return { data: dataToGet, maxType };
  };

  const { data, maxType } = parseData(dataChart);

  return {
    COLORS,
    data,
    maxType,
    opacity,
    relationShipsToShow: data.filter((d) => d.value > 0).map((d) => d.name),
  };
};
