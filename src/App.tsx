import { NavBar } from "antd-mobile";
import {
  Route,
  Switch,
  MemoryRouter as Router,
  //@ts-expect-error react-router-dom5的问题
} from "react-router-dom";

import s from "./App.module.scss";
import { Bottom } from "./common/view/components";
import { routerConfig } from "./router";

const App = () => {
  return (
    <Router initialEntries={["/abstract-concrete-library"]}>
      <div className={s.app}>
        {/* <div className={s.top}>
          <NavBar>配合路由使用</NavBar>
        </div> */}
        <div className={s.body}>
          {routerConfig.map((item) => {
            return (
              <Switch key={item.key}>
                <Route exact path={item.key}>
                  {item.comp}
                </Route>
              </Switch>
            );
          })}
        </div>
        <div className={s.bottom}>
          <Bottom />
        </div>
      </div>
    </Router>
  );
};
export default App;
