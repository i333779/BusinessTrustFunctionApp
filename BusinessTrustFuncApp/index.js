const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config");
const CosmosClient = require('@azure/cosmos').CosmosClient
const dbContext = require("./data/databaseContext");
var newItem = {};

module.exports = async function main(context, req) {


   context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.name || (req.body)) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: req.body
        };
        newItem = req.body;
    }
    else {
        console.log(req);
        context.res = {
            status: 400,
            body: "Could not update"
        };
    }

  
    const { endpoint, key, databaseId, containerId } = config;

    const client = new CosmosClient({ endpoint, key });
  
    const database = client.database(databaseId);
    const container = database.container(containerId);
  
    // Make sure Tasks database is already setup. If not, create it.
    await dbContext.create(client, databaseId, containerId);
    // </CreateClientObjectDatabaseContainer>
    
    try {
      // <QueryItems>
      console.log(`Querying container: Items`);
  
      // query to return all items
      const querySpec = {
        query: "SELECT * from c"
      };
      
      // read all items in the Items container
      const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll();
  
      items.forEach(item => {
        console.log(`${item.EmpId}`);
      });
      // </QueryItems>
      
      // <CreateItem>
      /** Create new item
       * newItem is defined at the top of this file
       */
      const { resource: createdItem } = await container.items.create(newItem);
      
      console.log(`\r\nCreated new item: ${createdItem.EmpId}\r\n`);
      // </CreateItem>
      
      // <UpdateItem>
      /** Update item
       * Pull the id and partition key value from the newly created item.
       * Update the isComplete field to true.
       */
      const { id, EmpId } = createdItem;
  
      createdItem.isComplete = true;
  
      const { resource: updatedItem } = await container
        .item(id, EmpId)
        .replace(createdItem);
  
      console.log(`Updated item: ${updatedItem.EmpId}`); 
      console.log(`Updated isComplete to ${updatedItem.isComplete}\r\n`);
      // </UpdateItem>
      
      // <DeleteItem>    
      /**
       * Delete item
       * Pass the id and partition key value to delete the item
       */
      // const { resource: result } = await container.item(id, EmpId).delete();
      // console.log(`Deleted item with id: ${EmpId}`);
      // </DeleteItem>  
      
    } catch (err) {
      console.log(err.message);
    }

};