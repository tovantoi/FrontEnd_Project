import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Menu.css"; // Đảm bảo có CSS kèm theo

const CategoryDropdown = () => {
  const [groupedCategories, setGroupedCategories] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://localhost:7022/minimal/api/get-categories")
      .then((res) => res.json())
      .then((data) => {
        const groups = {};

        data.forEach((cat) => {
          const base = cat.name.split(" ")[0]; // "Áo", "Quần", "Giày"
          if (!groups[base]) groups[base] = [];
          groups[base].push(cat);
        });

        setGroupedCategories(groups);
      })
      .catch((err) => console.error("Lỗi khi load danh mục:", err));
  }, []);

  return (
    <ul className="menu">
      {Object.entries(groupedCategories).map(([baseName, categories]) => (
        <li className="menu-item has-submenu" key={baseName}>
          {categories.length > 1 ? (
            <>
              <span>{baseName}</span>
              <ul className="submenu">
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    onClick={() => navigate(`/category/${cat.id}`)}
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <span onClick={() => navigate(`/category/${categories[0].id}`)}>
              {categories[0].name}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};

export default CategoryDropdown;
