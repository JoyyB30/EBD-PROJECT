import { Link, useNavigate } from "react-router-dom";

export default function NavBar({ links = [], onLogout }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: 12,
        borderBottom: "1px solid #eee",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        {links.map((l) => (
          <Link key={l.to} to={l.to}>
            {l.label}
          </Link>
        ))}
      </div>

      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          gap: 10,
        }}
      >
        {onLogout && <button onClick={onLogout}>Logout</button>}
      </div>
    </div>
  );
}