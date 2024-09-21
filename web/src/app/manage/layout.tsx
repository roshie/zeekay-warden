// /Users/justinbenito/Justin-Benito/Projects/zeekay-warden/web/src/app/user/layout.tsx

import React from 'react';

const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div>
            <header>
                <h1>Manage Page</h1>
            </header>
            <main>{children}</main>

        </div>
    );
};

export default UserLayout;