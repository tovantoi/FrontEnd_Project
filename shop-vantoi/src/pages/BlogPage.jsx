import React, { useEffect, useState } from "react";
import BlogList from "../components/BlogList";
import BlogDetail from "../components/BlogDetail";
import "../CSS/BlogList.css";
import "../CSS/BlogDetail.css";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetch("https://localhost:7022/minimal/api/get-blogs")
      .then((res) => res.json())
      .then((data) => {
        const activeBlogs = data.filter((blog) => blog.isActive == 1); // lọc blog đang hoạt động
        setBlogs(activeBlogs);
      })
      .catch(console.error);
  }, []);

  const fetchBlogDetail = async (id) => {
    const res = await fetch(
      `https://localhost:7022/minimal/api/get-detail-blog?id=${id}`
    );
    const data = await res.json();
    setSelectedBlog(data);
  };

  return selectedBlog ? (
    <BlogDetail blog={selectedBlog} onBack={() => setSelectedBlog(null)} />
  ) : (
    <BlogList blogs={blogs} onSelect={fetchBlogDetail} />
  );
};

export default BlogPage;
