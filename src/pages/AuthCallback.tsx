import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const process = async () => {
      // Handle OAuth callback URL params reliably
      const hash = window.location.hash;
      const hasCode = hash.includes("access_token") || window.location.search.includes("code=");
      if (hasCode) {
        // exchange if needed (for PKCE/code flow)
        try {
          // For hash-based tokens, getSession is enough; for code flow, exchangeCodeForSession
          if (window.location.search.includes("code=")) {
            const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
            if (error) {
              // eslint-disable-next-line no-console
              console.warn('exchangeCodeForSession error', error.message);
            }
          } else {
            await supabase.auth.getSession();
          }
        } finally {
          navigate("/", { replace: true });
        }
      } else {
        navigate("/", { replace: true });
      }
    };
    process();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Confirming your account...
    </div>
  );
};

export default AuthCallback;