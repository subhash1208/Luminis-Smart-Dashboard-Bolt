import { useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../utils/cn';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
  const navigate = useNavigate();

  return (
    <nav className={cn('flex', className)} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <button
            onClick={() => navigate('/houses')}
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600"
          >
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </button>
        </li>
        
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              {item.path ? (
                <button
                  onClick={() => navigate(item.path!)}
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-primary-600 md:ml-2"
                >
                  {item.label}
                </button>
              ) : (
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  {item.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;