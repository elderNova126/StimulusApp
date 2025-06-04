import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { IItem } from '../components/Company/AutoSuggestion/AutoSuggestion';
import CompanyQueries from '../graphql/Queries/CompanyQueries';
import { setTags as setTagsInStore, Tag } from '../stores/features/company';
const { GET_COMPANY_TAGS, FILTER_COMPANY_TAGS } = CompanyQueries;
// hook fot get all tags

const useTags = (search: string) => {
  const [tags, setTags] = useState<IItem[]>([]);
  const dispatch = useDispatch();
  const [initialTags, setInitialTags] = useState<IItem[]>([]);

  // get top 50 tags
  const [getTags, { loading }] = useLazyQuery(GET_COMPANY_TAGS, {
    fetchPolicy: 'cache-and-network',
    onCompleted({ getCompanyDistinctTags }) {
      if (getCompanyDistinctTags?.tags && getCompanyDistinctTags?.tags.length > 0) {
        setTags(getCompanyDistinctTags?.tags.map((tag: string) => ({ value: tag, exists: true })));
        setInitialTags(getCompanyDistinctTags?.tags.map((tag: string) => ({ value: tag, exists: true })));
      }
    },
  });
  // filter tags by search
  const [filterTags] = useLazyQuery(FILTER_COMPANY_TAGS, {
    fetchPolicy: 'cache-and-network',
    onCompleted({ filterCompanyTag }) {
      if (filterCompanyTag?.tags && filterCompanyTag?.tags.length > 0) {
        const result: IItem[] = (filterCompanyTag?.tags ?? []).map((tag: string) => ({ value: tag, exists: true }));
        setTags(result);
      }
    },
  });

  useEffect(() => {
    getTags();
  }, []);

  useEffect(() => {
    // already exist in top 50 tags
    const exist = initialTags?.filter((tag: IItem) => tag.value.toLowerCase().startsWith(search.toLowerCase()));
    if (exist.length > 0) {
      setTags(exist);
    } else if (search && search.length > 0) {
      const result = initialTags
        ? initialTags.filter((tag: IItem) => tag.value.toLowerCase().startsWith(search.toLowerCase()))
        : [];
      if (result.length > 0) {
        setTags(result);
      } else if (search.length >= 3) {
        filterTags({ variables: { tag: search.toString() } });
        setTags([]);
      } else {
        setTags(initialTags);
      }
    } else {
      setTags(initialTags);
    }
  }, [search]);

  const addTag = (currentTags: Tag[], tag: IItem) => {
    if (currentTags.filter((item) => item.tag === tag.value).length === 0) {
      dispatch(setTagsInStore([...currentTags, { tag: tag.value }]));
    } else {
      // set to tags
      setTags([...tags, tag]);
    }
  };

  const removeTag = (currentTags: Tag[], tag: IItem) => {
    if (currentTags.filter((item) => item.tag === tag.value).length) {
      dispatch(setTagsInStore(currentTags.filter((item) => item.tag !== tag.value)));
      // set to tags
      setTags(tags.filter((item) => item.value !== tag.value));
    }
  };

  return { initialTags, tags, loading, addTag, removeTag };
};

export { useTags };
