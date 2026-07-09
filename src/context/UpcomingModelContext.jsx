import { createContext, useContext, useMemo } from 'react';
import { useModels } from './ModelsContext';
import {
  DEFAULT_UPCOMING_DISPLAY,
  findUpcomingModel,
  modelToUpcomingDisplay,
} from '../utils/upcomingModelData';

const UpcomingModelContext = createContext(null);

export const useUpcomingModel = () => {
  const ctx = useContext(UpcomingModelContext);
  if (!ctx) {
    return {
      display: DEFAULT_UPCOMING_DISPLAY,
      linkedModel: null,
      loading: false,
    };
  }
  return ctx;
};

export const UpcomingModelProvider = ({ children }) => {
  const { models, loading } = useModels();

  const value = useMemo(() => {
    const linkedModel = findUpcomingModel(models);
    const display = linkedModel
      ? modelToUpcomingDisplay(linkedModel)
      : DEFAULT_UPCOMING_DISPLAY;
    return { display, linkedModel, loading };
  }, [models, loading]);

  return (
    <UpcomingModelContext.Provider value={value}>
      {children}
    </UpcomingModelContext.Provider>
  );
};
