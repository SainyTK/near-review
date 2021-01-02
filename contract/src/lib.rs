use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap, Vector};
use near_sdk::json_types::U128;
use near_sdk::wee_alloc;
use near_sdk::{env, near_bindgen, Promise};

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct Product {
    product_id: u64,
    owner: String,
    ipfs_hash: String,
    price: u128,
    review_value: u128,
    allow_self_purchase: bool,
}

#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct Order {
    order_id: u64,
    seller: String,
    product_id: u64,
    customer: String,
    price: u128,
    review_value: u128,
    ipfs_hash: String,
    purchased_at: u64,
    reviewed_at: u64,
    gave_helpful_at: u64,
}

impl Order {
    fn new(
        order_id: u64,
        seller: String,
        product_id: u64,
        customer: String,
        price: u128,
        review_value: u128,
        ipfs_hash: String,
    ) -> Self {
        Self {
            order_id,
            seller,
            product_id,
            customer,
            price,
            review_value,
            ipfs_hash,
            purchased_at: 0,
            reviewed_at: 0,
            gave_helpful_at: 0,
        }
    }
}

#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct Review {
    order_id: u64,
    ipfs_hash: String
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct ReviewContract {
    products_of: UnorderedMap<String, Vec<Product>>,
    profile_of: UnorderedMap<String, String>,
    orders: Vector<Order>,
    reviews: Vector<Review>
}

impl Default for ReviewContract {
    fn default() -> Self {
        Self {
            products_of: UnorderedMap::new(vec![0]),
            profile_of: UnorderedMap::new(vec![1]),
            orders: Vector::new(vec![2]),
            reviews: Vector::new(vec![3])
        }
    }
}

#[near_bindgen]
impl ReviewContract {
    pub fn create_product(
        &mut self,
        ipfs_hash: String,
        price: U128,
        review_value: U128,
        allow_self_purchase: bool,
    ) {
        let account_id = env::signer_account_id();
        let products = self.products_of.get(&account_id);
        match products {
            None => {
                let product = Product {
                    product_id: 0,
                    owner: account_id.clone(),
                    ipfs_hash,
                    price: u128::from(price),
                    review_value: u128::from(review_value),
                    allow_self_purchase,
                };
                let v = vec![product];
                self.products_of.insert(&account_id, &v);
            }
            Some(mut product_list) => {
                let product = Product {
                    product_id: product_list.len() as u64,
                    owner: account_id.clone(),
                    ipfs_hash,
                    price: u128::from(price),
                    review_value: u128::from(review_value),
                    allow_self_purchase,
                };
                product_list.push(product);
                self.products_of.insert(&account_id, &product_list);
            }
        }
    }

    pub fn create_order(
        &mut self,
        product_id: u64,
        customer: String,
        price: U128,
        ipfs_hash: String,
    ) -> Option<u64> {
        let next_id = self.orders.len() as u64;
        let account_id = env::signer_account_id();
        let products = self.products_of.get(&account_id);
        match products {
            None => {
                assert!(false, "No products");
                None
            }
            Some(product_list) => {
                if (product_list.len() as u64) > product_id {
                    let product = &product_list[product_id as usize];
                    let order = Order::new(
                        next_id,
                        account_id,
                        product_id,
                        customer,
                        u128::from(price),
                        product.review_value,
                        ipfs_hash,
                    );
                    self.orders.push(&order);
                    Some(next_id)
                } else {
                    assert!(false, "Product not found");
                    None
                }
            }
        }
    }

    pub fn post_review(&mut self, order_id: u64, ipfs_hash: String) {
        let account_id = env::signer_account_id();
        let order = self.orders.get(order_id);
        match order {
            None => {
                assert!(false, "Order not found");
            },
            Some (mut order) => {
                assert!(order.customer == account_id, "Cannot use other's order");
                assert!(order.purchased_at > 0, "Please purchase a product first");
                assert!(order.reviewed_at == 0, "A purchased order can be used to review once");

                let review = Review { order_id, ipfs_hash };
                self.reviews.push(&review);

                let now = env::block_timestamp();
                order.reviewed_at = now;
                self.orders.replace(order_id, &order);
            }
        }

    }

    pub fn update_product(
        &mut self,
        product_id: u64,
        ipfs_hash: String,
        price: U128,
        review_value: U128,
        allow_self_purchase: bool,
    ) {
        let account_id = env::signer_account_id();
        let products = self.products_of.get(&account_id);
        match products {
            None => {
                assert!(false, "You have no product");
            }
            Some(mut product_list) => {
                if (product_list.len() as u64) > product_id {
                    let product = Product {
                        product_id,
                        owner: account_id.clone(),
                        ipfs_hash,
                        price: u128::from(price),
                        review_value: u128::from(review_value),
                        allow_self_purchase,
                    };

                    product_list[product_id as usize] = product;
                    self.products_of.insert(&account_id, &product_list);
                } else {
                    assert!(false, "Product not found");
                }
            }
        }
    }

    pub fn update_profile(&mut self, ipfs_hash: String) {
        let account_id = env::signer_account_id();
        self.profile_of.insert(&account_id, &ipfs_hash);
    }

    #[payable]
    pub fn purchase(&mut self, order_id: u64) {
        let order = self.orders.get(order_id as u64);
        match order {
            None => {
                assert!(false, "Order not found");
            }
            Some(mut order) => {
                let account_id = env::signer_account_id();
                if account_id.eq(&order.customer) {
                    let products = self.products_of.get(&order.seller);
                    match products {
                        None => assert!(false, "The seller has no products"),
                        Some(_) => {
                            let attached_deposit = env::attached_deposit();
                            if attached_deposit.eq(&order.price) {
                                let remain = order.price - order.review_value;
                                Promise::new(order.seller.clone()).transfer(remain);

                                let ts_now = env::block_timestamp();

                                order.purchased_at = ts_now;
                                self.orders.replace(order_id as u64, &order);
                            } else {
                                assert!(false, "Please pay equal to the order price");
                            }
                        }
                    }
                } else {
                    assert!(false, "This is not your order");
                }
            }
        }
    }

    pub fn get_all_products(self) -> Vec<(u64, String, String, u128, u128, bool)> {
        self.products_of
            .iter()
            .flat_map(|product_list| {
                product_list
                    .1
                    .iter()
                    .map(|product| {
                        let Product {
                            product_id,
                            owner,
                            ipfs_hash,
                            price,
                            review_value,
                            allow_self_purchase,
                        } = product;
                        (
                            *product_id,
                            owner.clone(),
                            ipfs_hash.clone(),
                            *price,
                            *review_value,
                            *allow_self_purchase,
                        )
                    })
                    .collect::<Vec<(u64, String, String, u128, u128, bool)>>()
            })
            .collect()
    }

    pub fn get_products_of(
        self,
        account_id: String,
    ) -> Option<Vec<(u64, String, String, u128, u128, bool)>> {
        let products = self.products_of.get(&account_id);
        match products {
            None => None,
            Some(product_list) => Some(
                product_list
                    .iter()
                    .map(|product| {
                        let Product {
                            product_id,
                            owner,
                            ipfs_hash,
                            price,
                            review_value,
                            allow_self_purchase,
                        } = product;
                        (
                            *product_id,
                            owner.clone(),
                            ipfs_hash.clone(),
                            *price,
                            *review_value,
                            *allow_self_purchase,
                        )
                    })
                    .collect(),
            ),
        }
    }

    pub fn get_product_of(
        self,
        account_id: String,
        product_id: u64,
    ) -> Option<(u64, String, String, u128, u128, bool)> {
        let products = self.products_of.get(&account_id);
        match products {
            None => None,
            Some(product_list) => {
                let product = &product_list[product_id as usize];
                if (product_list.len() as u64) > product_id {
                    let Product {
                        product_id,
                        owner,
                        ipfs_hash,
                        price,
                        review_value,
                        allow_self_purchase,
                    } = product;
                    Some((
                        *product_id,
                        owner.clone(),
                        ipfs_hash.clone(),
                        *price,
                        *review_value,
                        *allow_self_purchase,
                    ))
                } else {
                    None
                }
            }
        }
    }

    pub fn get_profile_of(self, account_id: String) -> Option<String> {
        self.profile_of.get(&account_id)
    }

    pub fn get_orders(self) -> Vec<(u64, String, u64, String, u128, u128, String, u64, u64, u64)> {
        self.orders
            .iter()
            .map(|o| {
                let Order {
                    order_id,
                    seller,
                    product_id,
                    customer,
                    price,
                    review_value,
                    ipfs_hash,
                    purchased_at,
                    reviewed_at,
                    gave_helpful_at,
                } = o;
                (
                    order_id,
                    seller,
                    product_id,
                    customer,
                    price,
                    review_value,
                    ipfs_hash,
                    purchased_at,
                    reviewed_at,
                    gave_helpful_at,
                )
            })
            .collect()
    }

    pub fn get_reviews(self) -> Vec<(u64, String)> {
        self.reviews.iter().map(|review| {
            let Review { order_id, ipfs_hash } = review;
            (order_id, ipfs_hash)
        }).collect()
    }
}
