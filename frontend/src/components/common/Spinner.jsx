const Spinner = () => {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="relative">
          <div className="
            h-12 
            w-12 
            rounded-full 
            border-4 
            border-t-blue-500 
            border-r-blue-500 
            border-b-blue-200 
            border-l-blue-200 
          animate-spin">
          </div>
        </div>
      </div>
    );
  };

export default Spinner;