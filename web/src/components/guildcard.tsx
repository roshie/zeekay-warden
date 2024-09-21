'use client'
import { useState } from 'react';

interface Role {
  roleId: string;
  roleName: string;
}

interface Guild {
  guildName: string;
  guildId: string;
  roles: Role[];
}

interface GuildCardProps {
  guild: Guild;
}

const GuildCard: React.FC<GuildCardProps> = ({ guild }) => {
    console.log('guild', guild);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [rolesData, setRolesData] = useState<Record<string, string>>({});

  const handleInputChange = (roleId: string, value: string) => {
    setRolesData((prev) => ({ ...prev, [roleId]: value }));
  };

  const handleSubmit = () => {
    console.log(JSON.stringify(rolesData, null, 2));
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 className="text-xl font-semibold">{guild.guildName}</h2>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
      >
        Manage
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">Manage Roles</h3>
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Role Name</th>
                  <th className="border px-4 py-2">Input</th>
                </tr>
              </thead>
              <tbody>
                {guild.roles.map((role) => (
                  <tr key={role.roleId}>
                    <td className="border px-4 py-2">{role.roleName}</td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        onChange={(e) => handleInputChange(role.roleId, e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={handleSubmit}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Submit
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 ml-2 text-gray-600 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuildCard;
