import { useLog } from '../context/LogContext';

const useBookmarks = () => {
  const { bookmarkedLogs, toggleBookmark } = useLog();
  return { bookmarkedLogs, handleBookmarkToggle: toggleBookmark };
};

export default useBookmarks;