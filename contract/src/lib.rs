use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap, Vector};
use near_sdk::json_types::U128;
use near_sdk::wee_alloc;
use near_sdk::{env, near_bindgen, Promise};
use std::collections::HashMap;

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
    helpful_deadline: u64,
    purchased_at: u64,
    reviewed_at: u64,
    gave_helpful_at: u64
}

impl Order {
    fn new(
        order_id: u64,
        seller: String,
        product_id: u64,
        customer: String,
        price: u128,
        review_value: u128,
        ipfs_hash: String
    ) -> Self {
        Self {
            order_id,
            seller,
            product_id,
            customer,
            price,
            review_value,
            ipfs_hash,
            helpful_deadline: 0,
            purchased_at: 0,
            reviewed_at: 0,
            gave_helpful_at: 0,
        }
    }
}

#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct Comment {
    owner: String,
    ipfs_hash: String,
    created_at: u64
}

#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct Version {
    ipfs_hash: String,
    updated_at: u64,
    deleted_at: u64,
    unused_at: u64,
    block_index: u64
}

#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct Review {
    order_id: u64,
    versions: Vec<Version>,
    helpfuls: Vec<String>,
    comments: Vec<Comment>
}

impl Review {
    fn new(order_id: u64, ipfs_hash: String) -> Self {
        let ts = env::block_timestamp();
        let block_index = env::block_index();
        Self { 
            order_id, 
            versions: vec![Version { ipfs_hash, updated_at: ts, deleted_at: 0, unused_at: 0, block_index }], 
            helpfuls: vec![], 
            comments: vec![]
        }
    }

    fn update(&mut self, ipfs_hash: String) {
        let ts = env::block_timestamp();
        let block_index = env::block_index();
        self.versions.insert(0 as usize, Version { ipfs_hash, updated_at: ts, deleted_at: 0, unused_at: 0, block_index });
    }

    fn delete(&mut self) {
        let ts = env::block_timestamp();
        let block_index = env::block_index();
        self.versions.insert(0 as usize, Version { ipfs_hash: String::from(""), updated_at: ts, deleted_at: ts, unused_at: 0, block_index });
    }

    fn unuse(&mut self) {
        let ts = env::block_timestamp();
        let block_index = env::block_index();
        self.versions.insert(0 as usize, Version { ipfs_hash: String::from(""), updated_at: ts, deleted_at: 0, unused_at: ts, block_index });
    }
}

#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct Vote {
    value: u128,
    got_reward: bool,
    ipfs_hash: String
}

#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct Issue {
    issuer: String,
    target_id: u64,
    created_at: u64,
    deadline: u64,
    max_vote: u128,
    additional_reward: u64,
    vote_yes: HashMap<String, Vote>,
    vote_no: HashMap<String, Vote>
}

impl Issue {
    fn new(target_id: u64, deadline: u64, max_vote: u128, ipfs_hash: String, additional_reward: u64) -> Self {
        let now = env::block_timestamp();
        let issuer = env::signer_account_id();
        let value = env::attached_deposit();

        let mut vote_yes = HashMap::new();
        vote_yes.insert(issuer.clone(), Vote {value , got_reward: false, ipfs_hash});

        Self { 
            issuer: issuer.clone(),
            target_id,
            created_at: now,
            deadline,
            max_vote,
            additional_reward,
            vote_yes,
            vote_no: HashMap::new()
        }
    }
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct ReviewContract {
    products_of: UnorderedMap<String, Vec<Product>>,
    profile_of: UnorderedMap<String, String>,
    orders: Vector<Order>,
    reviews: UnorderedMap<u64, Review>,
    issues: Vector<Issue>,
    helpful_timout: u64,
    last_vote_period: u64,
    extend_vote_peroid: u64
}

impl Default for ReviewContract {
    fn default() -> Self {
        Self {
            products_of: UnorderedMap::new(vec![0]),
            profile_of: UnorderedMap::new(vec![1]),
            orders: Vector::new(vec![2]),
            reviews: UnorderedMap::new(vec![3]),
            issues: Vector::new(vec![4]),
            helpful_timout: 30 * 24 * 60 * 60 * 1_000_000_000, //1 month,
            last_vote_period: 5 * 60 * 1_000_000_000, //5 minutes
            extend_vote_peroid: 5 * 60 * 1_000_000_000,
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

    pub fn create_order( &mut self, product_id: u64, customer: String, price: U128, ipfs_hash: String) -> Option<u64> {
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
                        ipfs_hash
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

                let review = Review::new(order_id, ipfs_hash);
                self.reviews.insert(&order_id, &review);

                let now = env::block_timestamp();
                order.reviewed_at = now;
                self.orders.replace(order_id, &order);
            }
        }
    }

    pub fn update_review(&mut self, order_id: u64, ipfs_hash: String) {
        let account_id = env::signer_account_id();
        let order = self.orders.get(order_id);
        match order {
            None => {
                assert!(false, "Order not found");
            },
            Some (order) => {
                assert!(order.customer == account_id, "Cannot use other's order");
                assert!(order.reviewed_at > 0, "You have not yet posted a review");
                let review = self.reviews.get(&order_id);
                match review {
                    None => {
                        assert!(false, "Review not found");
                    },
                    Some (mut review) => {
                        review.update(ipfs_hash);
                        self.reviews.insert(&order_id, &review);
                    }
                }
            }
        }
    }

    pub fn delete_review(&mut self, order_id: u64) {
        let account_id = env::signer_account_id();
        let order = self.orders.get(order_id);
        match order {
            None => {
                assert!(false, "Order not found");
            },
            Some (order) => {
                assert!(order.customer == account_id, "Cannot use other's order");
                assert!(order.reviewed_at > 0, "You have not yet posted a review");
                let review = self.reviews.get(&order_id);
                match review {
                    None => {
                        assert!(false, "Review not found");
                    },
                    Some (mut review) => {
                        review.delete();
                        self.reviews.insert(&order_id, &review);
                    }
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
                                order.helpful_deadline = ts_now + self.helpful_timout;

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

    pub fn give_helpful(&mut self, order_id: u64, target_id: u64) {
        let order = self.orders.get(order_id as u64);
        let target = self.orders.get(target_id as u64);
        let now = env::block_timestamp();
        match order {
            None => {
                assert!(false, "Order not found");
            }
            Some(mut order) => {
                match target {
                    None => {
                        assert!(false, "Target not found");
                    }
                    Some(target) => {
                        let account_id = env::signer_account_id();
                        assert!(order.customer == account_id, "This is not your orders");
                        assert!(order.seller == target.seller && order.product_id == target.product_id, "Not the same product");
                        assert!(order.customer != target.customer, "Cannot give yourself score");
                        assert!(order.purchased_at > 0, "Please purchase a product first");
                        assert!(order.gave_helpful_at == 0, "This order was already used to give a helpful score");
                        assert!(order.helpful_deadline > now, "Already reached deadline");

                        let review = self.reviews.get(&target_id);
                        match review {
                            None => {
                                assert!(false, "Not found review");
                            } Some (mut review) => {
                                review.helpfuls.push(account_id);
                                let ts_now = env::block_timestamp();
                                order.gave_helpful_at = ts_now;
    
                                Promise::new(target.customer.clone()).transfer(order.review_value);
    
                                self.orders.replace(order_id as u64, &order);
                                self.reviews.insert(&target_id, &review);
                            }
                        }

                    }
                }
            }
        }
    }

    pub fn create_comment(&mut self, target_id: u64, ipfs_hash: String) {
        let review = self.reviews.get(&target_id);
        match review {
            None => {
                assert!(false, "Target not found");
            },
            Some (mut review) => {
                let account_id = env::signer_account_id();
                let now = env::block_timestamp();
                let comment = Comment{owner: account_id, ipfs_hash, created_at: now};
                review.comments.push(comment);
                self.reviews.insert(&target_id, &review);
            }
        }
    }

    #[payable]
    pub fn open_issue(&mut self, order_id: u64, target_id: u64, deadline: u64, max_vote: U128, ipfs_hash: String, additional_reward: i64) {
        let account_id = env::signer_account_id();
        let order = self.orders.get(order_id);
        let target = self.orders.get(target_id);
        let now = env::block_timestamp();
        let value = env::attached_deposit();
        match order {
            None => {
                assert!(false, "Order not found");
            },
            Some (order) => {
                match target {
                    None => {
                        assert!(false, "Target not found");
                    },
                    Some (target) => {
                        assert!(order.customer == account_id, "Cannot use other's order");
                        assert!(order.purchased_at > 0, "Please purchase a product first");
                        assert!(order.seller == target.seller, "Cannot vote on different seller");
                        assert!(order.product_id == target.product_id, "Cannot vote on different product");
                        assert!(deadline > now, "Cannot use this deadline");
                        assert!(value <= u128::from(max_vote), "Exceed max vote");

                        let reward_order = self.orders.get(additional_reward as u64);
                        match reward_order {
                            None => {
                                assert!(additional_reward < 0, "Reward not found");
                            },
                            Some (mut reward_order) => {
                                assert!(reward_order.gave_helpful_at == 0 && now > reward_order.helpful_deadline, "Order is still operated");
                                reward_order.gave_helpful_at = now;
                                self.orders.replace(additional_reward as u64, &reward_order);
                            }
                        }
        
                        let issue = Issue::new(target_id, deadline, u128::from(max_vote), ipfs_hash, additional_reward as u64);
                        self.issues.push(&issue);
                    }
                }
            }
        }
    }

    #[payable]
    pub fn vote(&mut self, issue_id: u64, order_id: u64, agree: bool, ipfs_hash: String) {
        let issue = self.issues.get(issue_id);
        let order = self.orders.get(order_id);
        let now = env::block_timestamp();
        let account_id = env::signer_account_id();
        let value = env::attached_deposit();
        match issue {
            None => {
                assert!(false, "Issue not found");
            },
            Some (mut issue) => {
                match order {
                    None => {
                        assert!(false, "Order not found");
                    },
                    Some (order) => {
                        let target = self.orders.get(issue.target_id);
                        match target {
                            None => {
                                assert!(false, "Target not found");
                            },
                            Some (target) => {
                                assert!(order.customer == account_id, "Cannot use other's order");
                                assert!(order.purchased_at > 0, "Please purchase a product first");
                                assert!(order.seller == target.seller, "Cannot vote on different seller");
                                assert!(order.product_id == target.product_id, "Cannot vote on different product");
                                assert!(issue.deadline > now, "Vote time is up");

                                if agree {
                                    if issue.vote_yes.contains_key(&account_id) {
                                        assert!(issue.vote_yes[&account_id].value + value <= issue.max_vote, "Exceed max vote");
                                        let vote = Vote { 
                                            value: issue.vote_yes[&account_id].value + value, 
                                            got_reward: false, 
                                            ipfs_hash 
                                        };
                                        issue.vote_yes.insert(account_id.clone(), vote);
                                    } else {
                                        assert!(value + value <= issue.max_vote, "Exceed max vote");
                                        let vote = Vote { value, got_reward: false, ipfs_hash };
                                        issue.vote_yes.insert(account_id.clone(), vote);
                                    }
                                } else {
                                    if issue.vote_no.contains_key(&account_id) {
                                        assert!(issue.vote_no[&account_id].value + value <= issue.max_vote, "Exceed max vote");
                                        let vote = Vote { 
                                            value: issue.vote_no[&account_id].value + value, 
                                            got_reward: false, 
                                            ipfs_hash 
                                        };
                                        issue.vote_no.insert(account_id.clone(), vote);
                                    } else {
                                        assert!(value + value <= issue.max_vote, "Exceed max vote");
                                        let vote = Vote { value, got_reward: false, ipfs_hash };
                                        issue.vote_no.insert(account_id.clone(), vote);
                                    }
                                }

                                if now > issue.deadline - self.last_vote_period {
                                    issue.deadline += self.extend_vote_peroid;
                                }

                                self.issues.replace(issue_id, &issue);
                            }
                        }
                    }
                }
            }
        }
    }

    pub fn get_reward(&mut self, issue_id: u64) {
        let issue = self.issues.get(issue_id);
        let account_id = env::signer_account_id();
        let now = env::block_timestamp();
        match issue {
            None => {
                assert!(false, "Issue not found");
            },
            Some (mut issue) => {
                assert!(issue.deadline > now, "Issue is still opening");
                let total_yes = issue.vote_yes.iter().fold(0, |acc, vote| acc + vote.1.value);
                let total_no = issue.vote_no.iter().fold(0, |acc, vote| acc + vote.1.value);
                let vote_yes = issue.vote_yes[&account_id].value;
                let vote_no = issue.vote_no[&account_id].value;
                let mut reward = 0;
                let mut additional_reward = 0;

                let reward_order = self.orders.get(issue.additional_reward);
                match reward_order {
                    None => {},
                    Some (reward_order) => {
                        additional_reward = reward_order.review_value;
                    }
                }

                if total_yes > total_no {
                    reward = (vote_yes / total_yes) * (total_no + additional_reward);
                    issue.vote_yes.insert(account_id.clone(), Vote { 
                        value: vote_yes, 
                        got_reward: true, 
                        ipfs_hash: issue.vote_yes[&account_id].ipfs_hash.clone()
                    });

                    let review = self.reviews.get(&issue.target_id);
                    match review {
                        None => {},
                        Some (mut review) => {
                            review.unuse();
                            self.reviews.insert(&issue.target_id, &review);
                        }
                    }
                } else if total_no > total_yes {
                    reward = (vote_no / total_no) * (total_yes + additional_reward);
                    issue.vote_no.insert(account_id.clone(), Vote { 
                        value: vote_no, 
                        got_reward: true, 
                        ipfs_hash: issue.vote_no[&account_id].ipfs_hash.clone()
                    });
                } else {
                    reward = vote_yes + vote_no + ((vote_yes + vote_no) / (total_yes + total_no)) * additional_reward;
                    issue.vote_yes.insert(account_id.clone(), Vote { 
                        value: vote_yes, 
                        got_reward: true, 
                        ipfs_hash: issue.vote_yes[&account_id].ipfs_hash.clone()
                    });
                    issue.vote_no.insert(account_id.clone(), Vote { 
                        value: vote_no, 
                        got_reward: true, 
                        ipfs_hash: issue.vote_no[&account_id].ipfs_hash.clone()
                    });
                }

                Promise::new(account_id).transfer(reward);
                self.issues.replace(issue_id, &issue);
            }
        }
    }

    pub fn get_all_products(self) -> Vec<(u64, String, String, U128, U128, bool)> {
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
                            U128::from(*price),
                            U128::from(*review_value),
                            *allow_self_purchase,
                        )
                    })
                    .collect::<Vec<(u64, String, String, U128, U128, bool)>>()
            })
            .collect()
    }

    pub fn get_products_of(self, account_id: String) -> Option<Vec<(u64, String, String, U128, U128, bool)>> {
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
                            U128::from(*price),
                            U128::from(*review_value),
                            *allow_self_purchase,
                        )
                    })
                    .collect()
            ),
        }
    }

    pub fn get_product_of(self, account_id: String, product_id: u64) -> Option<(u64, String, String, U128, U128, bool)> {
        let products = self.products_of.get(&account_id);
        match products {
            None => None,
            Some(product_list) => {
                let product = &product_list[product_id as usize];
                if (product_list.len() as u64) > product_id {
                    let Product { product_id, owner, ipfs_hash, price, review_value, allow_self_purchase } = product;
                    Some((
                        *product_id,
                        owner.clone(),
                        ipfs_hash.clone(),
                        U128::from(*price),
                        U128::from(*review_value),
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

    pub fn get_orders(self) -> Vec<(u64, String, u64, String, U128, U128, String, u64, u64, u64, u64)> {
        self.orders
            .iter()
            .map(|o| {
                let Order { order_id, seller, product_id, customer, price, review_value, ipfs_hash, helpful_deadline,
                    purchased_at, reviewed_at, gave_helpful_at, 
                } = o;
                ( order_id, seller, product_id, customer, U128::from(price), U128::from(review_value),
                  ipfs_hash, helpful_deadline, purchased_at, reviewed_at, gave_helpful_at
                )
            })
            .collect()
    }

    pub fn get_reviews(self) -> Vec<(u64, Vec<(String, u64, u64, u64, u64)>, Vec<String>, Vec<(String, String, u64)>)> {
        self.reviews.iter().map(|review| {
            let Review { order_id, versions, helpfuls, comments } = review.1;
            let version_list = versions.iter().map(|version| {
                (version.ipfs_hash.clone(), version.updated_at, version.deleted_at, version.unused_at, version.block_index)
            }).collect();
            let comment_list = comments.iter().map(|comment| {
                (comment.owner.clone(), comment.ipfs_hash.clone(), comment.created_at)
            }).collect();
            (order_id, version_list, helpfuls, comment_list)
        }).collect()
    }

    pub fn get_issues(self) -> Vec<(String, u64, u64, u64, U128, u64, Vec<(String, U128, bool, String)>, Vec<(String, U128, bool, String)>)> {
        self.issues.iter().map(|issue| {
            let Issue { issuer, target_id, created_at, deadline, max_vote, additional_reward, vote_yes, vote_no } = issue;
            let vote_yes_list = vote_yes.iter().map(|vote| {
                (vote.0.clone(), U128::from(vote.1.value), vote.1.got_reward, vote.1.ipfs_hash.clone())
            }).collect();
            let vote_no_list = vote_no.iter().map(|vote| {
                (vote.0.clone(), U128::from(vote.1.value), vote.1.got_reward, vote.1.ipfs_hash.clone())
            }).collect();
            (issuer.clone(), target_id, created_at, deadline, U128::from(max_vote), additional_reward, vote_yes_list, vote_no_list)
        }).collect()
    }
}
