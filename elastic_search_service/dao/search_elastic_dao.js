const client = require("../../src/config/elastic.js");
const { dishes_dao } = require("../../src/config/database_selector.js");

exports.ping = async () => {
  const result = await client.info();
  return result.body || result;
};
//search by name
exports.search = async (q) => {
  const result = await client.search({
    index: "dishes",
    query: {
      match: { nombre_plato: q }
    }
  });

   return result.hits.hits.map(hit => {
    const dish = hit._source;

    return {
      ...dish,
      description: dish.description || "Producto sin descripción"
    };
  });
};

exports.reindex = async () => {
  try {
    try {
      await client.indices.delete({ index: "dishes" });
    } catch (error) {
      if (error.meta?.statusCode !== 404) {
        throw error;
      }
    }

    await client.indices.create({ index: "dishes" });

    const dishes = await dishes_dao.getAll(); 

    for (const dish of dishes) {
      await client.index({
        index: "dishes",
        document: {
          ...dish,
          description: dish.description || "Producto sin descripción"
        }
      });
    }

    await client.indices.refresh({ index: "dishes" });

    return { message: "Reindexing completed" };

  } catch (error) {
    throw error;
  }
};

exports.searchByCategory = async (category) => {
  try {
    if (!category) {
      return { message:"Category parameter is required" };
    }

    const result = await client.search({
      index: "dishes",
      query: {
        match: {
          nombre_menu: category
          
        }
      }
    });

    const dishes = result.hits.hits.map(hit => ({
      ...hit._source
    }));

    return { dishes };

  } catch (error) {
    throw error;
  }
};