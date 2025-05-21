import React from "react";
import Banner from "../components/Banner";
import CategoryList from "../components/CategoryList";

const HomePage = () => {
  return (
    <div>
      <main>
        <Banner />
        <section id="categories">
          <CategoryList />
        </section>
      </main>
    </div>
  );
};

export default HomePage;
