import { useState, useEffect, useCallback } from 'react';

export function useRouter() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string) => {
    if (typeof window !== 'undefined') {
      if (to !== window.location.pathname) {
        window.history.pushState({}, '', to);
        setCurrentPath(to);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, []);

  // Parse path matching
  const isPostDetail = currentPath.startsWith('/post/');
  const postSlug = isPostDetail ? currentPath.replace('/post/', '').split('/')[0] : null;

  const isAdmin = currentPath.startsWith('/admin');
  const isAdminPostEdit = currentPath.startsWith('/admin/posts/edit/');
  const editPostId = isAdminPostEdit ? currentPath.replace('/admin/posts/edit/', '').split('/')[0] : null;

  return {
    pathname: currentPath,
    navigate,
    isPostDetail,
    postSlug,
    isAdmin,
    isAdminPostEdit,
    editPostId
  };
}
