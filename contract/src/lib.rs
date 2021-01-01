use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::wee_alloc;
use near_sdk::{env, near_bindgen};
use near_sdk::collections::UnorderedMap;
use near_sdk::json_types::U128;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct Product {
    product_id: u32,
    owner: String,
    ipfs_hash: String,
    price: u128,
    review_value: u128,
    allow_self_purchase: bool
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct ReviewContract {
    products_of: UnorderedMap<String, Vec<Product>>,
    profile_of: UnorderedMap<String, String>
}

impl Default for ReviewContract {
    fn default() -> Self {
        Self {
            products_of: UnorderedMap::new(vec![0]),
            profile_of: UnorderedMap::new(vec![1])
        }
    }
}

#[near_bindgen]
impl ReviewContract {
    pub fn create_product(&mut self, ipfs_hash: String, price: U128, review_value: U128, allow_self_purchase: bool) {
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
                    allow_self_purchase
                };
                let v = vec![product];
                self.products_of.insert(&account_id, &v);
            },
            Some(mut product_list) => {
                let product = Product {
                    product_id: product_list.len() as u32,
                    owner: account_id.clone(),
                    ipfs_hash,
                    price: u128::from(price),
                    review_value: u128::from(review_value),
                    allow_self_purchase
                };
                product_list.push(product);
                self.products_of.insert(&account_id, &product_list);
            }
        }
    }

    pub fn update_product(&mut self, product_id: u32,ipfs_hash: String, price: U128, review_value: U128, allow_self_purchase: bool) {
        let account_id = env::signer_account_id();
        let products = self.products_of.get(&account_id);
        match products {
            None => {
                assert!(false, "You have no product");
            },
            Some(mut product_list) => {
                if (product_list.len() as u32) > product_id {

                    let product = Product {
                        product_id,
                        owner: account_id.clone(),
                        ipfs_hash,
                        price: u128::from(price),
                        review_value: u128::from(review_value),
                        allow_self_purchase
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

    pub fn get_all_products(self) -> Vec<(u32, String, String, u128, u128, bool)> {
        self.products_of.iter().flat_map(|product_list| {
            product_list.1.iter().map(|product| {
                let Product {product_id, owner, ipfs_hash, price, review_value, allow_self_purchase } = product;
                (*product_id, owner.clone(), ipfs_hash.clone(), *price, *review_value, *allow_self_purchase)
            }).collect::<Vec<(u32, String, String, u128, u128, bool)>>()
        }).collect()
    }

    pub fn get_products_of(self, account_id: String) -> Option<Vec<(u32, String, String, u128, u128, bool)>> {
        let products = self.products_of.get(&account_id);
        match products {
            None => None,
            Some(product_list) => {
                Some(product_list.iter().map(|product| {
                    let Product { product_id, owner, ipfs_hash, price, review_value, allow_self_purchase } = product;
                    (*product_id, owner.clone(), ipfs_hash.clone(), *price, *review_value, *allow_self_purchase)
                }).collect())
            }
        }
    }

    pub fn get_product_of(self, account_id: String, product_id: u32) -> Option<(u32, String, String, u128, u128, bool)> {
        let products = self.products_of.get(&account_id);
        match products {
            None => None,
            Some(product_list) => {
                let product = &product_list[product_id as usize];
                if (product_list.len() as u32) > product_id {
                    let Product { product_id, owner, ipfs_hash, price, review_value, allow_self_purchase } = product;
                    Some((*product_id, owner.clone(), ipfs_hash.clone(), *price, *review_value, *allow_self_purchase))
                } else {
                    None
                }
            }
        }
    }

    pub fn get_profile_of(self, account_id: String) -> Option<String> {
        self.profile_of.get(&account_id)
    }
}