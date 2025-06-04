import saveAs from 'file-saver';
import JSZip from 'jszip';
import Papa from 'papaparse';
import * as R from 'ramda';
import { Certification, CompanyType, Contact } from '../components/Company/company.types';
import { EventLog } from '../components/EventsList/types';
import { Note } from '../graphql/types';
import { utcStringToLocalDate } from './date';
import { toCapitalCase } from './string';
import { SupplierType } from '../graphql/enums';

function capitalizeFirstLetter(target: string) {
  return target && target.charAt(0).toUpperCase() + target.slice(1);
}

const getCompanyName = (company: { doingBusinessAs?: string; legalBusinessName?: string }) =>
  company?.legalBusinessName ?? company?.doingBusinessAs ?? '';

const companyDataMapper = (data: any, scoreLabel: string, query = 'searchCompanies'): any[] => {
  const companies = data[query].results;
  let result: any = [];

  if (companies?.length) {
    result = companies.map((company: any) => {
      let scoreValue = `${scoreLabel}: 0`;
      const { results: scores } = company.stimulusScore;

      if (scores?.length) {
        scoreValue = `${scoreLabel}: ${Math.round(scores[0].scoreValue || 0)} `;
      }
      const isExternal = company?.tenantCompanyRelation?.type === 'external';
      return {
        ...company,
        displayName: getCompanyName(company),
        stimulusScore: scoreValue,
        companyInfo: `${capitalizeFirstLetter(company?.tenantCompanyRelation?.type ?? '')} ${
          !isExternal ? `- ${capitalizeFirstLetter(company?.tenantCompanyRelation?.status ?? '')}` : ''
        }`,
      };
    });
  }

  return result;
};

const scoreBreakdownTableMapper = (data: { results: any[] }) => {
  const score = data.results?.[0] ?? {};

  return [
    { component: 'Quality', value: Math.round(score.quality) || '-' },
    { component: 'Reliability', value: Math.round(score.reliability) || '-' },
    { component: 'Features', value: Math.round(score.features) || '-' },
    { component: 'Cost', value: Math.round(score.cost) || '-' },
    { component: 'Relationship', value: Math.round(score.relationship) || '-' },
    { component: 'Financial', value: Math.round(score.financial) || '-' },
    { component: 'Diversity', value: Math.round(score.diversity) || '-' },
    { component: 'Innovation', value: Math.round(score.innovation) || '-' },
    { component: 'Flexibility', value: Math.round(score.flexibility) || '-' },
    { component: 'Brand', value: Math.round(score.brand) || '-' },

    { component: 'TOTAL SCORE', value: Math.round(score.scoreValue) || '-' },
  ];
};

const projectTableMapper = (data: { results: any[] }, labels: { startDate: string; endDate: string }) => {
  if (data?.results?.length) {
    return data.results.map((project: any) => {
      const startDate = project.expectedStartDate ? utcStringToLocalDate(project.expectedStartDate) : 'N/A';
      const endDate = project.expectedEndDate ? utcStringToLocalDate(project.expectedEndDate) : 'N/A';

      return {
        ...project,
        subtitleInfo: `${labels.startDate}: ${startDate} to ${labels.endDate}: ${endDate}`,
        status: projectStatusMapper[project.status],
      };
    });
  }

  return [];
};

const inProgressProjectTableMapper = (
  data: { results: any[] },
  labels: { score: string; startDate: string; endDate: string }
) => {
  if (data?.results?.length) {
    const companiesOrder = [
      CompanyType.Awarded,
      CompanyType.ShortListed,
      CompanyType.Qualified,
      CompanyType.Considered,
    ];
    return data.results.map((project: any) => {
      const companies = (project.projectCompany || [])
        .filter(({ type }: any) => type !== 'CLIENT')
        .sort((a: any, b: any) => (companiesOrder.indexOf(a.type) > companiesOrder.indexOf(b.type) ? 1 : -1))
        .map((projectCompany: any) => getCompanyName(projectCompany.company))
        .join(', ');
      const startDate = project.startDate ? utcStringToLocalDate(project.startDate) : 'N/A';
      const endDate = project.expectedEndDate ? utcStringToLocalDate(project.expectedEndDate) : 'N/A';
      return {
        ...project,
        subtitleDate: `${labels.startDate}: ${startDate} to ${labels.endDate}: ${endDate}`,
        companies: `${companies.length ? companies : ''}`,
      };
    });
  }

  return [];
};

const notesMapper = (notes: Note[]) => {
  const notesObject = R.clone(notes)
    .reverse()
    .reduce(
      (acc: any, curr: any) => ({
        ...acc,
        [curr.id]: { ...curr, replies: [] },
      }),
      {} as any
    );
  Object.values(notesObject).forEach((note: any) => {
    if (note?.parentNote) {
      notesObject[note?.parentNote]?.replies?.push?.(note);
    }
  });
  return Object.values(notesObject).filter((note: any) => !note.parentNote);
};

const projectStatusMapper: any = {
  NEW: 'New',
  OPEN: 'Open',
  INPROGRESS: 'Progress',
  COMPLETED: 'Completed',
  INREVIEW: 'Review',
  CANCELED: 'Canceled',
};

const cleanEmptyValues = (data: any) => {
  const result = R.clone(data);
  Object.keys(result).forEach((key: string) => {
    if (result[key] === null || result[key] === undefined) {
      delete result[key];
    }
  });
  return result;
};

const validateURL = (str: string) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  const validWebsite = str === '' || str === null ? true : !!pattern.test(str);
  return validWebsite;
};

const mapperDownloadList = (data: any, list: any) => {
  const result = data?.discoverCompanies?.results;
  let certifications: Certification[] = [];
  let locations: Location[] = [];
  let contacts: Contact[] = [];
  let companies: any[] = [];

  result?.map((data: any) => {
    if (data?.certificationsByIndex) {
      certifications?.push(
        data?.certificationsByIndex?.map((certification: any) => {
          return {
            'Legal Business Name': data?.legalBusinessName,
            'Tax ID': data?.taxIdNo,
            Name: certification.name,
            Type: certification.type,
            'Start Date': certification.certificationDate,
            'Expiration Date': certification.expirationDate,
            'Issued By': certification.issuedBy,
          };
        })
      );
    }
    if (data?.locationsByIndex) {
      locations.push(
        data?.locationsByIndex?.map((location: any) => {
          return {
            'Legal Business Name': data?.legalBusinessName,
            'Tax ID': data?.taxIdNo,
            'Address type': location?.type,
            City: location.city,
            State: location.state,
            ZIP: location.postalCode,
            Country: location.country,
            'Street Address': location.addressStreet,
            'Street Address 2': location.addressStreet2,
            'Street Address 3': location.addressStreet3,
          };
        })
      );
    }
    if (data?.contactsByIndex) {
      contacts.push(
        data?.contactsByIndex?.map((contacts: any) => {
          return {
            'Legal Business Name': data?.legalBusinessName,
            'Tax ID': data?.taxIdNo,
            Email: contacts.email,
            'Job Title': contacts.jobTitle,
            Phone: contacts.phone,
            'First Name': contacts.firstName,
            'Last Name': contacts.lastName,
            'Address type': contacts?.type,
            City: contacts.city,
            State: contacts.state,
            ZIP: contacts?.postalCode,
            Country: contacts.country,
            'Street Address': contacts.addressStreet,
            'Street Address 2': contacts.addressStreet2,
            'Street Address 3': contacts.addressStreet3,
          };
        })
      );
    }
    companies.push(
      [data].map(({ locations, contacts, certifications, ...data }: any) => {
        return {
          'Legal Business Name': data.legalBusinessName,
          'Doing Business As': data.doingBusinessAs,
          'Tax ID': data.taxIdNo,
          'Type of Legal Entity': data.typeOfLegalEntity,
          Website: data.website,
          Spend: data?.tenantCompanyRelation?.totalSpent,
          Score: data?.stimulusScore?.results[0]?.scoreValue?.toFixed(),
          Type: toCapitalCase(data?.tenantCompanyRelation?.type),
          Status:
            data?.tenantCompanyRelation?.type === SupplierType.EXTERNAL
              ? ''
              : toCapitalCase(data?.tenantCompanyRelation?.status),
          'Relationship Start Date': utcStringToLocalDate(data?.tenantCompanyRelation.created),
          Industries: data?.industries
            ?.filter((title: any) => !!title.title !== false)
            .map((industry: any) => {
              return [` ${industry.code ? industry.code : ''} ${industry.title}`];
            }),
        };
      })
    );

    return null;
  });
  certifications = certifications.flat(1);
  locations = locations.flat(1);
  contacts = contacts.flat(1);
  companies = companies.flat(1);

  const zip = new JSZip();

  [
    { results: certifications, name: 'certifications' },
    { results: locations, name: 'locations' },
    { results: contacts, name: 'contacts' },
    { results: companies, name: 'companies' },
  ].forEach((csv: any) => {
    let file = csv.results.length
      ? Papa.unparse(csv.results, {
          quotes: false,
          quoteChar: '"',
          escapeChar: '"',
          delimiter: ',',
          newline: '\n',
        })
      : [];
    file = csv.results.length ? '\uFEFF' + file : file;
    return zip.file(csv.name + '.csv', file);
  });

  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, list.name + '.zip');
  });
};

const filterLogsToggle = (events: EventLog[], companies: boolean, projects: boolean, lists: boolean) => {
  if (companies && projects && lists) {
    return events;
  }
  if (companies && !projects && lists) {
    return events.filter((logs: EventLog) => logs.entityType === 'COMPANY' || logs.entityType === 'LIST');
  }
  if (!companies && projects && !lists) {
    return events.filter((logs: EventLog) => logs.entityType === 'PROJECT');
  }
  if (!companies && !projects && lists) {
    return events.filter(
      (logs: EventLog) =>
        logs.entityType === 'LIST' ||
        logs.code === 'ADD_TO_COMPANY_LIST' ||
        logs.code === 'REMOVE_FROM_COMPANY_LIST' ||
        (logs.meta as any).setting === 'isFavorite'
    );
  }

  if (!companies && projects && lists) {
    return events.filter((logs: EventLog) => logs.entityType === 'PROJECT' || logs.entityType === 'LIST');
  }
  if (companies && !projects && !lists) {
    return events.filter(
      (logs: EventLog) =>
        logs.entityType === 'COMPANY' &&
        logs.code !== 'ADD_TO_COMPANY_LIST' &&
        logs.code !== 'REMOVE_FROM_COMPANY_LIST' &&
        (logs.meta as any).setting !== 'isFavorite'
    );
  }

  if (companies && projects && !lists) {
    return events.filter(
      (logs: EventLog) =>
        logs.entityType === 'PROJECT' ||
        (logs.entityType === 'COMPANY' &&
          logs.code !== 'ADD_TO_COMPANY_LIST' &&
          logs.code !== 'REMOVE_FROM_COMPANY_LIST' &&
          (logs.meta as any).setting !== 'isFavorite')
    );
  }

  if (!companies && !projects && !lists) {
    return [];
  }
};

const notificationListMapper = (notifications: any) => {
  return notifications.reduce((acc: any, cur: any) => {
    if (cur.event.code === 'ADD_TO_COMPANY_LIST' && cur.event.meta.listId !== undefined) {
      const listId = cur.event.meta.listId;
      const companyName = cur.event.meta.companyName;
      const listName = cur.event.meta.listName;

      const entry = acc.find((entry: any) => entry.listId === listId && entry.listName === listName);
      if (entry) {
        entry.count++;
        if (!entry.companyNames.includes(companyName)) {
          entry.companyNames.push(companyName);
        }
      } else {
        acc.push({
          listId,
          listName,
          count: 1,
          companyNames: [companyName],
        });
      }
    }
    return acc;
  }, []);
};

const countRepeatedCompanies = (companiesList: any, companyIds: any) => {
  let counter = 0;
  for (const company of companiesList) {
    if (companyIds.includes(company?.id?.toString())) {
      counter++;
    }
  }
  return counter;
};

const findUniqueIds = (companies: any, idCompanies: any) => {
  const uniqueIds = new Set();

  idCompanies.forEach((id: any) => {
    if (!companies.some((company: any) => company.id === id)) {
      uniqueIds.add(id);
    }
  });

  return Array.from(uniqueIds);
};

interface CompanyIds {
  id: string;
}
const removeDuplicates = (companies: CompanyIds[]) => {
  const uniqueIds = new Set();
  const uniqueObjects: CompanyIds[] = [];
  companies?.forEach((obj: CompanyIds) => {
    if (!uniqueIds.has(obj.id)) {
      uniqueIds.add(obj.id);
      uniqueObjects.push(obj);
    }
  });
  return uniqueObjects;
};

export {
  companyDataMapper,
  scoreBreakdownTableMapper,
  inProgressProjectTableMapper,
  projectTableMapper,
  projectStatusMapper,
  notesMapper,
  capitalizeFirstLetter,
  getCompanyName,
  cleanEmptyValues,
  validateURL,
  filterLogsToggle,
  mapperDownloadList,
  notificationListMapper,
  countRepeatedCompanies,
  findUniqueIds,
  removeDuplicates,
};
