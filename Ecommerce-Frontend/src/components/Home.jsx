import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = ({ selectedCategory }) => {
  const {
    data,
    isError,
    addToCart,
    removeFromCart,
    getProductQuantity,
    refreshData,
  } = useContext(AppContext);

  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    if (data && data.length > 0) {
      const fetchImagesAndUpdateProducts = async () => {
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/product/${product.id}/image`,
                { responseType: "blob" }
              );
              const imageUrl = URL.createObjectURL(response.data);
              return { ...product, imageUrl };
            } catch (error) {
              console.error(
                "Error fetching image for product ID:",
                product.id,
                error
              );
              return { ...product, imageUrl: "placeholder-image-url" };
            }
          })
        );
        setProducts(updatedProducts);
      };

      fetchImagesAndUpdateProducts();
    }
  }, [data]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "18rem" }}>
        <img
          src={unplugged}
          alt="Error"
          style={{ width: "100px", height: "100px" }}
        />
      </h2>
    );
  }

  return (
    <div
      className="grid"
      style={{
        marginTop: "64px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        padding: "20px",
      }}
    >
      {filteredProducts.length === 0 ? (
        <h2
          className="text-center"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          No Products Available
        </h2>
      ) : (
        filteredProducts.map((product) => {
          const {
            id,
            brand,
            name,
            price,
            productAvailable,
            stockQuantity,
            imageUrl,
          } = product;

          const quantity = getProductQuantity(id);
          const outOfStock = !productAvailable || stockQuantity <= 0;
          const reachedLimit = quantity >= stockQuantity;

          return (
            <div
              className="card mb-3"
              style={{
                width: "250px",
                height: "360px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                borderRadius: "10px",
                overflow: "hidden",
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "stretch",
              }}
              key={id}
            >
              <Link
                to={`/product/${id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img
                  src={imageUrl}
                  alt={name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    padding: "5px",
                    borderRadius: "10px 10px 10px 10px",
                  }}
                />
                <div
                  className="card-body"
                  style={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "10px",
                  }}
                >
                  <div>
                    <h5
                      className="card-title"
                      style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}
                    >
                      {name.length > 20
                        ? name.substring(0, 17).toUpperCase() + "..."
                        : name.toUpperCase()}
                    </h5>
                    <i
                      className="card-brand"
                      style={{ fontStyle: "italic", fontSize: "0.8rem" }}
                    >
                      {"~ " + brand}
                    </i>
                  </div>
                  <hr className="hr-line" style={{ margin: "10px 0" }} />
                  <div className="home-cart-price">
                    <h5
                      className="card-text"
                      style={{
                        fontWeight: "600",
                        fontSize: "1.1rem",
                        marginBottom: "5px",
                      }}
                    >
                      <i className="bi bi-currency-rupee"></i>
                      {price}
                    </h5>
                  </div>
                </div>
              </Link>

              {/* Quantity Control */}
              {quantity === 0 ? (
                <button
                  className="btn-hover color-9"
                  style={{
                    margin: "10px 25px 10px",
                    backgroundColor: outOfStock ? "#dc3545" : "#0d6efd",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "8px",
                    cursor: outOfStock ? "not-allowed" : "pointer",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!outOfStock) {
                      addToCart(product);
                      toast.success("Product added to cart");
                    } else {
                      toast.error("Out of Stock");
                    }
                  }}
                  disabled={outOfStock}
                >
                  {outOfStock ? "Out of Stock" : "Add to Cart"}
                </button>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <button
                    className="btn btn-outline-danger"
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromCart(product);
                    }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: "bold" }}>{quantity}</span>
                  <button
                    className="btn btn-outline-success"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!reachedLimit) {
                        addToCart(product);
                      } else {
                        toast.warning("Cannot add more. Stock limit reached.");
                      }
                    }}
                    disabled={outOfStock || reachedLimit}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Home;
