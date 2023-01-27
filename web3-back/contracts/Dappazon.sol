// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract Dappazon {
  event Add(string name, uint256 cost, uint256 quantity);
  struct Item {
    uint256 id;
    string name;
    string category;
    string image;
    uint256 cost;
    uint256 rating;
    uint256 stock;
  }

  address public owner;
  mapping(uint256 => Item) public items;

  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can call this function");
    _;
  }

  constructor() {
    owner = msg.sender;
  }

  // Add Products
  function add(
    uint256 _id,
    string memory _name,
    string memory _category,
    string memory _image,
    uint256 _cost,
    uint256 _rating,
    uint256 _stock
  ) public onlyOwner {
    // Create an item
    Item memory item = Item(
      _id,
      _name,
      _category,
      _image,
      _cost,
      _rating,
      _stock
    );

    // Add item to array
    items[_id] = item;

    // Emit Add event
    emit Add(_name, _cost, _stock);
  }
}
