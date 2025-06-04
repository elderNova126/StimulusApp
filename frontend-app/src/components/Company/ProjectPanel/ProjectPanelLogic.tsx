import { InternalProject } from '../../../graphql/types';

export const defaultProjectSort = (defaultFilter: InternalProject[], order: boolean) =>
  [...defaultFilter].sort((a, b) => {
    const valueA: any = new Date(a.endDate);
    const valueB: any = new Date(b.endDate);
    const valueNullA: any = a.endDate === null;
    const valueNullB: any = b.endDate === null;
    return order === false ? valueNullA - valueNullB || +(valueA > valueB) || -(valueA < valueB) : valueB - valueA;
  });

export const sortProjectArray = ({
  type,
  Projects,
  setProjects,
  order,
  defaultSort,
}: {
  type: any;
  Projects: InternalProject[];
  setProjects: any;
  order: boolean;
  defaultSort: InternalProject[];
}) => {
  switch (type) {
    case 'targetScore':
      return setProjects(
        [...Projects].sort((a, b) => {
          const valueA: number = a.scoreProject ?? 0;
          const valueB: number = b.scoreProject ?? 0;
          return order === false ? valueA - valueB : valueB - valueA;
        })
      );
    case 'startDate':
      return setProjects(
        [...Projects].sort((a, b) => {
          const valueA: any = new Date(a.startDate);
          const valueB: any = new Date(b.startDate);
          return order === false ? valueA - valueB : valueB - valueA;
        })
      );
    case 'endDate':
      return setProjects(defaultSort);
    case 'budget':
      return setProjects(
        [...Projects].sort((a: any, b: any) => {
          const valueA: number = a.budget as number;
          const valueB: number = b.budget as number;
          return order === false ? valueA - valueB : valueB - valueA;
        })
      );
    case 'title':
      return setProjects(
        [...Projects].sort((a, b) => {
          return order === false ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        })
      );
    case 'remainingDays':
      return setProjects(
        [...Projects].sort((a, b) => {
          const valueA: number = a.remainingDays ?? 0;
          const valueB: number = b.remainingDays ?? 0;
          return order === false ? valueA - valueB : valueB - valueA;
        })
      );
    default:
      return Projects;
  }
};

export const GetBudgetSpend = (project: InternalProject) => {
  const { projectCompany } = project;
  if (projectCompany) {
    const evaluatios = projectCompany[0]?.evaluations ?? [];
    if (evaluatios.length === 0) return 0;
    const evaluatio = evaluatios[0];
    return evaluatio?.budgetSpend;
  } else {
    return null;
  }
};

export const GetScoreProject = (project: InternalProject) => {
  const { projectCompany } = project;
  if (projectCompany) {
    const evaluatios = projectCompany[0]?.evaluations ?? [];
    if (evaluatios.length === 0) return 0;
    const evaluatio = evaluatios[0];
    return evaluatio?.scoreValue;
  } else {
    return null;
  }
};
