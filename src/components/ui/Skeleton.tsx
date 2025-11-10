export function UserListSkeleton() {
    return (
      <div className="space-y-2 p-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center p-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            <div className="ml-3 h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }