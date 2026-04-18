import ModelCustomizer from './ModelCustomizer';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { allCategories } from '../data/models';

// Thin wrapper to label the page as DRAFT without changing logic
const DraftCustomizer = () => {
  const { id } = useParams();
  // Resolve the model name from static data for gating (draft-safe)
  const modelName = useMemo(() => {
    const mid = parseInt(id);
    for (const cat of allCategories) {
      const found = cat.models.find(m => m.id === mid);
      if (found) return found.name;
    }
    return null;
  }, [id]);

  // We reuse ModelCustomizer UI/logic and overlay a small DRAFT ribbon using a portal-like absolute element
  // The ribbon is purely visual; no behavior change
  const Ribbon = useMemo(() => (
    <div className="fixed top-24 right-4 z-[10000]">
      <div className="px-3 py-1 rounded-md bg-orange-600 text-white text-xs font-semibold shadow-lg">
        DRAFT
      </div>
    </div>
  ), []);

  return (
    <>
      {Ribbon}
      <ModelCustomizer />
    </>
  );
};

export default DraftCustomizer;

