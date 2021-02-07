import 'regenerator-runtime/runtime'
import React from 'react'
import 'antd/dist/antd.css';
import './assets/styles/font-awesome.css';
import './assets/styles/global.css'
import Topbar from './components/Topbar';
import { Route, Switch } from 'react-router-dom';
import ManageProductsPage from './pages/ManageProducts';
import ManageProductPage from './pages/ManageProduct';
import CreateProductPage from './pages/CreateProduct';
import HomePage from './pages/Home';
import ProfilePage from './pages/Profile';
import SettingProfilePage from './pages/SettingProfile';
import ProductPage from './pages/Product';
import styled from 'styled-components';
import WriteReviewPage from './pages/WriteReview';
import ReviewPage from './pages/Review';
import CommentsPage from './pages/Comments';
import IssuesPage from './pages/Issues';
import IssuePage from './pages/Issue';

const ContentWrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - 64px);
  background-color: var(--bg-light);
`

export default function App() {

  return (
    <div>
      <Topbar />
      <ContentWrapper>
        <Switch>
          <Route path='/reviews/:issueId' component={IssuePage} />
          <Route path='/issues' component={IssuesPage} />
          <Route path='/reviews/:orderId/comments' component={CommentsPage} />
          <Route path='/reviews/:orderId' component={ReviewPage} />
          <Route path='/products/:seller/:productId/review/:orderId' component={WriteReviewPage} />
          <Route path='/products/:seller/:productId' component={ProductPage} />
          <Route path='/settingProfile' component={SettingProfilePage} />
          <Route path='/profile' component={ProfilePage} />
          <Route path='/manageProducts/:productId' component={ManageProductPage} />
          <Route path='/manageProducts' component={ManageProductsPage} />
          <Route path='/createProduct' component={CreateProductPage} />
          <Route path='/' component={HomePage} />
        </Switch>
      </ContentWrapper>
    </div>
  )

}