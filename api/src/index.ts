import { defineEndpoint } from "@directus/extensions-sdk";
import { urlencoded } from "express";
import { Bitrix, Method } from "@2bad/bitrix";

export default defineEndpoint({
  id: "api",
  handler: (router) => {
    router.post("/favorites/:idProduct", async (req, res) => {
      const userId = req.accountability?.user;
      //console.log(req.accountability)
      async function sendAuthCookies() {
        const token = req.headers["authorization"];
        fetch(
          `http://${process.env.HOST}:${process.env.PORT}/users/${req.accountability?.user}?fields[]=favoritesProduct`,
          {
            headers: {
              Authorization: `Bearer ${process.env.SECRET}`,

              "Content-type": "application/json;charset=utf-8",
            },
            method: "GET",
          }
        )
          .then((data) => {
            if (data.status === 200) {
              return data.json();
            } else {
              // console.log({
              // 	errorFavoritesGet: {
              // 		status: data.status, error: data.statusText
              // 	}
              // });
              res.status(data.status).send(data.statusText);
            }
          })
          .then((data) => {
            // console.log({
            // 	succesFavoritesGet:{
            // 		user: req.accountability?.user, favorites: data.data.favoritesProduct
            // 	}
            // })
            const dataFavorites = data.data?.favoritesProduct
              ? data.data?.favoritesProduct
              : [];
            if (dataFavorites.includes(req.params.idProduct))
              res.send(dataFavorites);
            let fetchFavorites = [...dataFavorites, req.params.idProduct];
            fetch(
              `http://${process.env.HOST}:${process.env.PORT}/users/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${process.env.SECRET}`,

                  "Content-type": "application/json;charset=utf-8",
                },
                method: "PATCH",
                body: JSON.stringify({
                  favoritesProduct: fetchFavorites,
                }),
              }
            )
              .then((data) => {
                if (data.status === 200) {
                  // console.log({
                  // 	succesFavoritesUpdate:{
                  // 		user: userId, favorites: fetchFavorites
                  // 	}
                  // })
                  res.cookie("favoritesProduct", fetchFavorites);
                  res.send(fetchFavorites);
                } else {
                  // console.log({
                  // 	errorFavoritesUpdate: {
                  // 		status: data.status, error: data.statusText
                  // 	}
                  // });
                }
              })
              .catch((error) => {
                res.send(error);
              });
          })
          .catch((error) => {
            res.send(error);
          });
      }
      const favorites = req.cookies["favoritesProduct"]
        ? req.cookies["favoritesProduct"]
        : [];
      if (favorites.length > 0) {
        if (favorites.includes(req.params.idProduct)) {
          res.send(favorites);
        } else {
          favorites.push(req.params.idProduct);
          if (userId) {
            await sendAuthCookies();
          } else {
            res.cookie("favoritesProduct", favorites);
            res.send(favorites);
          }
        }
      } else {
        if (userId) {
          await sendAuthCookies();
        } else {
          res.cookie("favoritesProduct", [req.params.idProduct]);
          res.json([req.params.idProduct]);
        }
      }
    }),
      router.delete("/favorites/:idProduct", async (req, res) => {
        const userId = req.accountability?.user;
        //console.log(req.accountability)
        async function sendAuthCookies() {
          const token = req.headers["authorization"];
          fetch(
            `http://${process.env.HOST}:${process.env.PORT}/users/${req.accountability?.user}?fields[]=favoritesProduct`,
            {
              headers: {
                Authorization: `Bearer ${process.env.SECRET}`,

                "Content-type": "application/json;charset=utf-8",
              },
              method: "GET",
            }
          )
            .then((data) => {
              if (data.status === 200) {
                return data.json();
              } else {
                // console.log({
                // 	errorFavoritesGet: {
                // 		status: data.status, error: data.statusText
                // 	}
                // });
                res.status(data.status).send(data.statusText);
              }
            })
            .then((data) => {
              // console.log({
              // 	succesFavoritesGet:{
              // 		user: req.accountability?.user, favorites: data.data.favoritesProduct
              // 	}
              // })
              const dataFavorites = data.data?.favoritesProduct
                ? data.data?.favoritesProduct
                : [];
              let fetchFavorites = [...dataFavorites];
              if (fetchFavorites.includes(req.params.idProduct)) {
                fetchFavorites = fetchFavorites.filter(
                  (index: number) =>
                    index !==
                    fetchFavorites[fetchFavorites.indexOf(req.params.idProduct)]
                );
              } else {
                res.send(dataFavorites);
              }
              fetch(
                `http://${process.env.HOST}:${process.env.PORT}/users/${userId}`,
                {
                  headers: {
                    Authorization: `Bearer ${process.env.SECRET}`,

                    "Content-type": "application/json;charset=utf-8",
                  },
                  method: "PATCH",
                  body: JSON.stringify({
                    favoritesProduct: fetchFavorites,
                  }),
                }
              )
                .then((data) => {
                  if (data.status === 200) {
                    // console.log({
                    // 	succesFavoritesUpdate:{
                    // 		user: userId, favorites: fetchFavorites
                    // 	}
                    // })
                    res.cookie("favoritesProduct", fetchFavorites);
                    res.send(fetchFavorites);
                  } else {
                    // console.log({
                    // 	errorFavoritesUpdate: {
                    // 		status: data.status, error: data.statusText
                    // 	}
                    // });
                  }
                })
                .catch((error) => {
                  res.send(error);
                });
            })
            .catch((error) => {
              res.send(error);
            });
        }
        const favorites = req.cookies["favoritesProduct"]
          ? req.cookies["favoritesProduct"]
          : [];
        if (favorites.length > 0) {
          if (favorites.includes(req.params.idProduct)) {
            const favoritesWithoutSelectedId = favorites.filter(
              (index: number) =>
                index !== favorites[favorites.indexOf(req.params.idProduct)]
            );
            if (userId) {
              await sendAuthCookies();
            } else {
              res.cookie("favoritesProduct", favoritesWithoutSelectedId);
              res.json(favoritesWithoutSelectedId);
            }
          } else {
            if (userId) {
              await sendAuthCookies();
            } else {
              res.cookie("favoritesProduct", favorites);
              res.json(favorites);
            }
          }
        } else {
          if (userId) {
            await sendAuthCookies();
          } else {
            res.cookie("favoritesProduct", []);
            res.json([]);
          }
        }
      }),
      router.get("/favorites", (req, res) => {
        if (req.accountability?.user) {
          const token = req.headers["authorization"];
          fetch(
            `http://${process.env.HOST}:${process.env.PORT}/users/${req.accountability?.user}?fields[]=favoritesProduct`,
            {
              headers: {
                Authorization: `Bearer ${process.env.SECRET}`,

                "Content-type": "application/json;charset=utf-8",
              },
              method: "GET",
            }
          )
            .then((data) => {
              if (data.status === 200) {
                return data.json();
              } else {
                // console.log({
                // 	errorFavoritesGet: {
                // 		status: data.status, error: data.statusText
                // 	}
                // });
                res.status(data.status).send(data.statusText);
              }
            })
            .then((data) => {
              // console.log({
              // 	succesFavoritesGet:{
              // 		user: req.accountability?.user, favorites: data.data.favoritesProduct
              // 	}
              // })
              res.cookie("favoritesProduct", data.data.favoritesProduct);
              res.json(data.data.favoritesProduct);
            })
            .catch((error) => {
              res.send(error);
            });
        } else {
          res.json(req.cookies.favoritesProduct);
        }
      }),
      router.delete("/favorites", (req, res) => {
        if (req.accountability?.user) {
          const token = req.headers["authorization"];
          fetch(
            `http://${process.env.HOST}:${process.env.PORT}/users/${req.accountability?.user}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.SECRET}`,

                "Content-type": "application/json;charset=utf-8",
              },
              method: "PATCH",
              body: JSON.stringify({
                favoritesProduct: [],
              }),
            }
          )
            .then((data) => {
              if (data.status === 200) {
                // console.log({
                // 	succesFavoritesReset:{
                // 		user: req.accountability?.user
                // 	}
                // })
                res.send([]);
              } else {
                // console.log({
                // 	errorFavoritesReset: {
                // 		status: data.status, error: data.statusText
                // 	}
                // });
                res.status(data.status).send(data.statusText);
              }
            })
            .catch((error) => {
              res.json(error);
            });
        } else {
          res.clearCookie("favoritesProduct");
          res.json("Favlorites clear");
        }
      }),
      router.post("/cart", async (req, res) => {
        const userId = req.accountability?.user;
        const token = req.headers["authorization"]
          ? req.headers["authorization"].replace(/^Bearer\s+/, "")
          : undefined;
        const body = req.body;
        const carts = req.cookies.cart;

        async function cartsToDb(body: any) {
          await fetch(
            `http://${process.env.HOST}:${process.env.PORT}/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.SECRET}`,

                "Content-type": "application/json;charset=utf-8",
              },
              method: "PATCH",
              body: JSON.stringify({
                cart: body,
              }),
            }
          )
            .then((data) => {
              if (data.status === 200) {
                return data.json();
              } else {
                res.status(data.status).send(data.statusText);
              }
            })
            .then((data) => {
              if (data.data.cart) {
                res.status(200).json(body);
              }
            });
        }

        async function cantFoundProduct(
          foundProduct: boolean,
          cartsFromDb: any
        ) {
          if (!foundProduct) {
            if (userId) {
              cartsToDb([...cartsFromDb, body]);
            } else {
              res.cookie("cart", [...carts, body]);
              res.json([...carts, body]);
            }
          }
        }

        async function addCart(products: any, send: boolean) {
          let sendCarts = [...(products?.cart ? products.cart : products)];
          //console.log(sendCarts);
          let foundProduct = false;
          for (let product of products) {
            if (product.id === body.id) {
              foundProduct = true;
              sendCarts = products.map((cart: any) => {
                if (cart.id === body.id) {
                  cart.count = Number(body.count);
                  if (cart.count < 0) cart.count = 0;
                }
                return cart;
              });
              if (send) {
                //console.log(sendCarts);
                await cartsToDb(sendCarts);
              } else {
                res.cookie("cart", sendCarts);
                res.json(sendCarts);
              }
            }
          }

          await cantFoundProduct(foundProduct, sendCarts);
        }
        if (body.hasOwnProperty("id") && body.hasOwnProperty("count")) {
          if (userId) {
            //console.log(token);
            fetch(
              `http://${process.env.HOST}:${process.env.PORT}/users/${userId}/?fields[]=cart`,
              {
                headers: {
                  Authorization: `Bearer ${process.env.SECRET}`,
                },
                method: "GET",
              }
            )
              .then((data) => {
                if (data.status === 200) {
                  return data.json();
                } else {
                  res.status(data.status).send(data.statusText);
                }
              })
              .then((data) => {
                if (data.data.cart) {
                  addCart(data.data.cart, true);
                }
              })
              .catch((error) => res.send(error));
          } else {
            if (carts) {
              addCart(carts, false);
            } else {
              res.cookie("cart", [body]);
              res.json([body]);
            }
          }
        } else {
          res.status(400).send("Bad request");
        }
      }),
      router.patch("/cart/:id", async (req, res) => {
        const userId = req.accountability?.user;
        const token = req.headers["authorization"]
          ? req.headers["authorization"].replace(/^Bearer\s+/, "")
          : undefined;
        const body = req.body;
        const carts = req.cookies.cart;
        const idProduct = req.params.id;

        async function cartsToDb(body: any) {
          await fetch(
            `http://${process.env.HOST}:${process.env.PORT}/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.SECRET}`,

                "Content-type": "application/json;charset=utf-8",
              },
              method: "PATCH",
              body: JSON.stringify({
                cart: body,
              }),
            }
          )
            .then((data) => {
              if (data.status === 200) {
                return data.json();
              } else {
                res.status(data.status).send(data.statusText);
              }
            })
            .then((data) => {
              if (data.data.cart) {
                res.status(200).json(body);
              }
            });
        }

        async function cantFoundProduct(
          foundProduct: boolean,
          cartsFromDb: any
        ) {
          if (!foundProduct) {
            if (userId) {
              cartsToDb([...cartsFromDb]);
            } else {
              res.cookie("cart", [...carts]);
              res.json([...carts]);
            }
          }
        }

        async function addCart(products: any, send: boolean) {
          let sendCarts = [...(products?.cart ? products.cart : products)];
          //console.log(sendCarts);
          let foundProduct = false;
          for (let product of products) {
            if (product.id === idProduct) {
              foundProduct = true;
              sendCarts = products.map((cart: any) => {
                if (cart.id === idProduct) {
                  cart.count = Number(cart.count) + Number(body.count);
                  if (cart.count < 0) cart.count = 0;
                }
                return cart;
              });
              if (send) {
                //console.log(sendCarts);
                await cartsToDb(sendCarts);
              } else {
                res.cookie("cart", sendCarts);
                res.json(sendCarts);
              }
            }
          }

          await cantFoundProduct(foundProduct, sendCarts);
        }
        if (body.hasOwnProperty("count")) {
          if (userId) {
            //console.log(token);
            fetch(
              `http://${process.env.HOST}:${process.env.PORT}/users/${userId}/?fields[]=cart`,
              {
                headers: {
                  Authorization: `Bearer ${process.env.SECRET}`,
                },
                method: "GET",
              }
            )
              .then((data) => {
                if (data.status === 200) {
                  return data.json();
                } else {
                  res.status(data.status).send(data.statusText);
                }
              })
              .then((data) => {
                if (data.data.cart) {
                  addCart(data.data.cart, true);
                }
              })
              .catch((error) => res.send(error));
          } else {
            if (carts) {
              addCart(carts, false);
            } else {
              res.cookie("cart", [carts]);
              res.json([carts]);
            }
          }
        } else {
          res.status(400).send("Bad request");
        }
      }),
      router.get("/cart", async (req, res) => {
        const userId = req.accountability?.user;

        if (!userId) return res.json(req.cookies.cart ?? []);
        const response = await fetch(
          `http://${process.env.HOST}:${process.env.PORT}/users/${userId}/?fields[]=cart`,
          {
            headers: {
              Authorization: `Bearer ${process.env.SECRET}`,
            },
            method: "GET",
          }
        );
        const data = await response.json();
        console.log("RESPOSMNE", response);
        if (response.status !== 200) {
          return res.status(response.status).json(data);
        }

        return res.json(data.data.cart ?? []);
      }),
      router.delete("/cart", (req, res) => {
        const userId = req.accountability?.user;
        const token = req.headers["authorization"]
          ? req.headers["authorization"].replace(/^Bearer\s+/, "")
          : undefined;
        if (userId) {
          fetch(
            `http://${process.env.HOST}:${process.env.PORT}/users/${userId}/?fields[]=cart`,
            {
              headers: {
                Authorization: `Bearer ${process.env.SECRET}`,

                "Content-type": "application/json;charset=utf-8",
              },
              method: "PATCH",
              body: JSON.stringify({
                cart: [],
              }),
            }
          )
            .then((data) => {
              if (data.status === 200) {
                return data.json();
              } else {
                res.status(data.status).send(data.statusText);
              }
            })
            .then((data) => {
              if (data.data.cart) {
                res.json(data.data.cart);
              }
            })
            .catch((error) => res.send(error));
        } else {
          res.clearCookie("cart", []);
          res.json([]);
        }
      }),
      router.delete("/cart/:id", (req, res) => {
        const userId = req.accountability?.user;
        const token = req.headers["authorization"]
          ? req.headers["authorization"].replace(/^Bearer\s+/, "")
          : undefined;
        const productId = req.params.id;
        const carts = req.cookies.cart;
        if (userId) {
          fetch(
            `http://${process.env.HOST}:${process.env.PORT}/users/${userId}/?fields[]=cart`,
            {
              headers: {
                Authorization: `Bearer ${process.env.SECRET}`,
              },
              method: "GET",
            }
          )
            .then((data) => {
              if (data.status === 200) {
                return data.json();
              } else {
                res.status(data.status).send(data.statusText);
              }
            })
            .then((data) => {
              if (data.data.cart) {
                const getCart = data.data.cart;
                const sendCart = getCart.filter(
                  (cart: any) => cart.id !== productId
                );
                fetch(
                  `http://${process.env.HOST}:${process.env.PORT}/users/${userId}/?fields[]=cart`,
                  {
                    headers: {
                      Authorization: `Bearer ${process.env.SECRET}`,

                      "Content-type": "application/json;charset=utf-8",
                    },
                    method: "PATCH",
                    body: JSON.stringify({
                      cart: sendCart,
                    }),
                  }
                )
                  .then((data) => {
                    if (data.status === 200) {
                      return data.json();
                    } else {
                      res.status(data.status).send(data.statusText);
                    }
                  })
                  .then((data) => {
                    if (data.data.cart) {
                      res.json(data.data.cart);
                    }
                  })
                  .catch((error) => res.send(error));
              }
            })
            .catch((error) => res.send(error));
        } else {
          if (carts) {
            const newCarts = carts.filter((cart: any) => cart.id !== productId);
            res.cookie("cart", newCarts);
            res.json(newCarts);
          } else {
            res.json([]);
          }
        }
      }),
      router.post("/cart/check", (req, res) => {
        const userId = req.accountability?.user;
        const carts = req.cookies.cart;

        function checkCarts(cartsId: string[], carts: any, token: string) {
          fetch(
            `http://${process.env.HOST}:${process.env.PORT
            }/items/products?filter={ "id": { "_in": ${JSON.stringify(
              cartsId
            )} }}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.SECRET}`,
              },
              method: "GET",
            }
          )
            .then((data) => {
              if (data.status === 200) {
                return data.json();
              } else {
                console.log(carts);
                res.status(data.status).send(data.statusText);
              }
            })
            .then((data) => {
              if (data == undefined) return;
              const succesResponse = [];
              const errorResponse = [];
              for (let product of data.data) {
                for (let cart of carts) {
                  if (cart.id === product.id) {
                    if (Number(product.count) >= Number(cart.count)) {
                      succesResponse.push({
                        id: product.id,
                        count: Number(cart.count),
                      });
                    } else {
                      errorResponse.push(product.id);
                    }
                  }
                }
              }
              if (errorResponse.length > 0) {
                res.status(400).send(errorResponse);
              } else {
                res.cookie("cart", succesResponse);
                res.status(200).send(succesResponse);
              }
            });
        }

        fetch(`http://${process.env.HOST}:${process.env.PORT}/auth/login`, {
          headers: {
            "Content-type": "application/json;charset=utf-8",
          },
          method: "POST",
          body: JSON.stringify({
            email: process.env.LOGIN,
            password: process.env.PASS,
          }),
        })
          .then((data) => {
            if (data.status === 200) {
              return data.json();
            } else {
              console.log(carts);
              res.status(data.status).send(data.statusText);
            }
          })
          .then((data) => {
            if (data == undefined) return;
            const token = data.data.access_token;
            if (userId) {
              fetch(
                `http://${process.env.HOST}:${process.env.PORT}/users/${userId}/?fields[]=cart`,
                {
                  headers: {
                    Authorization: `Bearer ${process.env.SECRET}`,
                  },
                  method: "GET",
                }
              )
                .then((data) => {
                  if (data.status === 200) {
                    return data.json();
                  } else {
                    res.send(data.statusText);
                  }
                })
                .then((data) => {
                  if (data == undefined) return;
                  const cartUser = data.data.cart;
                  const cartsId: string[] = [];
                  for (let cart of cartUser) {
                    cartsId.push(cart.id);
                  }
                  checkCarts(cartsId, cartUser, token);
                })
                .catch((error) => res.send(error));
            } else {
              if (carts) {
                const cartsId: string[] = [];
                for (let cart of carts) {
                  cartsId.push(cart.id);
                }
                checkCarts(cartsId, carts, token);
              } else {
                res.send([]);
              }
            }
          });
      });
    router.post("/order", async (req, res) => {
      if (req.accountability?.user === null)
        return res.status(401).json({ status: 401, text: "Unauthorized" })

      const body = req.body;
      let statusCode = 200;
      let message = "Successful";
      let objects: any = [];

      try {
        for (let product of body) {
          await fetch(
            `http://${process.env.HOST}:${process.env.PORT}/items/products/${product.id}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.SECRET}`,
                "Content-type": "application/json;charset=utf-8",
              },
              method: "GET",
            }
          ).then((data) => { return data.json() })
            .then(async (data) => {
              const { count, id } = data.data;
              const diffCount = Number(count) - product.count;
              console.log("id ", id, " count ", count, " diffCount ", diffCount)

              if (Number(count) <= 0 && diffCount < 0) {
                statusCode = 400;
                message = `Product ${id} count <= 0, current count = ${count}`;
                objects.push({ id: id, count: count });
              } else {
                await fetch(
                  `http://${process.env.HOST}:${process.env.PORT}/items/products/${product.id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${process.env.SECRET}`,
                      "Content-type": "application/json;charset=utf-8",
                    },
                    method: "PATCH",
                    body: JSON.stringify({ count: Number(diffCount) })
                  }
                ).then((data) => {
                  console.log({ id: product.id, status: data.status })
                })
              }
            })
        }
        return res.status(statusCode).json({ status: statusCode, message: message, objects: objects })
      } catch (err) {
        console.log(err);
        return res.status(400).json({ status: 400, text: err })
      }
    });
    router.post("/updateStatus", urlencoded(), async (req, res) => {
      console.log(req.body);
      console.log(req.body.data);
      if (req.body.auth.application_token === process.env.WEBHOOK_TOKEN) {
        const client = await Bitrix(String(process.env.BITRIX_URL));
        const id = req.body.data.FIELDS.ID;
        try {
          const { result } = await client.deals.get(id);
          console.log('result', result)
          /*switch (result.STAGE_ID.split(":")[1]) {
            case "NEW":
              currentStatus = "новая сделка"
              break;
            case "PREPARATION":
              currentStatus = "подготовка бумаг"
              break;
            case "PREPAYMENT_INVOICE":
              currentStatus = "отправка счёта"
              break;
            case "EXECUTING":
              currentStatus = "в процессе выполнения"
              break;
            case "FINAL_INVOICE":
              currentStatus = "финальный счёт"
              break;
            case "WON":
              currentStatus = "выиграна"
              break;
            case "LOSE":
              currentStatus = "проиграна, анализ причин не требуется"
              break;
            case "APOLOGY":
              currentStatus = "проиграна, требуется анализ причин"
              break;
            default:
              break;
          }*/
          await fetch(
            `http://${process.env.HOST}:${process.env.PORT}/items/orders?filter[number][_eq]=${id}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.SECRET}`,
                "Content-type": "application/json;charset=utf-8",
              },
              method: "GET",
            }
          )
            .then((data) => { return data.json() })
            .then(async (data) => {
              console.log(data.data[0].id);
              const order = data.data[0];
              await fetch(
                `http://${process.env.HOST}:${process.env.PORT}/items/orders/${order.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${process.env.SECRET}`,
                    "Content-type": "application/json;charset=utf-8",
                  },
                  method: "PATCH",
                  body: JSON.stringify({
                    status: result.STAGE_ID.split(":")[1],
                  })
                }
              ).then((data) => {
                console.log({ id: order.id, status: data.status })
              })
            })
        } catch (err) {
          console.log('Error', err)
        }
        res.send("Успех!");
      } else {
        res.status(401).send("Not auth");
      }
    })
  },
});
