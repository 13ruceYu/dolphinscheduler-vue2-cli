import Vue from 'vue'
import i18n from '@/module/i18n/index.js'
import Router from 'vue-router'
import BasicLayout from '../layouts/BasicLayout.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: (resolve) => require(['@/view/login/Login'], resolve),
      meta: {
        title: `${i18n.$t('Login')} - DolphinScheduler`,
      },
    },
    {
      path: '/',
      name: 'index',
      component: BasicLayout,
      redirect: {
        name: 'home',
      },
      children: [
        {
          path: '/home',
          name: 'home',
          component: (resolve) => require(['@/view/home/Home'], resolve),
          meta: {
            title: `${i18n.$t('Home')} - DolphinScheduler`,
            refresh_in_switched_tab: true,
          },
        },
        {
          path: '/projects',
          name: 'projects',
          component: (resolve) => require(['@/view/projects/Projects'], resolve),
          meta: {
            title: `${i18n.$t('Project')}`,
          },
          redirect: {
            name: 'projects-list',
          },
          children: [
            {
              path: '/projects/home',
              name: 'projects-home',
              component: (resolve) => require(['@/view/projects/pages/projectsHome/ProjectsHome'], resolve),
              meta: {
                title: `${i18n.$t('Project Home')}`,
                refresh_in_switched_tab: true,
              },
            },
            {
              path: '/projects/kinship',
              name: 'projects-kinship',
              component: (resolve) => require(['@/view/projects/pages/kinship/ProjectsKinship'], resolve),
              meta: {
                title: `${i18n.$t('Kinship')}`,
                refresh_in_switched_tab: true,
              },
            },
            {
              path: '/projects/list',
              name: 'projects-list',
              component: (resolve) => require(['@/view/projects/pages/list/ProjectsList'], resolve),
              meta: {
                title: `${i18n.$t('Project')}`,
                refresh_in_switched_tab: true,
              },
            },
            {
              path: '/projects/definition',
              name: 'definition',
              component: (resolve) => require(['@/view/projects/pages/definition/ProjectsDefinition'], resolve),
              meta: {
                title: `${i18n.$t('Process definition')}`,
                refresh_in_switched_tab: true,
              },
              redirect: {
                name: 'projects-definition-list',
              },
              children: [
                {
                  path: '/projects/definition/list',
                  name: 'projects-definition-list',
                  component: (resolve) =>
                    require(['@/view/projects/pages/definition/pages/list/DefinitionList'], resolve),
                  meta: {
                    title: `${i18n.$t('Process definition')}`,
                    refresh_in_switched_tab: true,
                  },
                },
                {
                  path: '/projects/definition/list/:id',
                  name: 'projects-definition-details',
                  component: (resolve) => require(['@/view/projects/pages/definition/pages/details/index'], resolve),
                  meta: {
                    title: `${i18n.$t('Process definition details')}`,
                    refresh_in_switched_tab: true,
                  },
                },
                {
                  path: '/projects/definition/create',
                  name: 'definition-create',
                  component: (resolve) => require(['@/view/projects/pages/definition/pages/create/index'], resolve),
                  meta: {
                    title: `${i18n.$t('Create process definition')}`,
                  },
                },
                {
                  path: '/projects/definition/tree/:id',
                  name: 'definition-tree-view-index',
                  component: (resolve) => require(['@/view/projects/pages/definition/pages/tree/index'], resolve),
                  meta: {
                    title: `${i18n.$t('TreeView')}`,
                    refresh_in_switched_tab: true,
                  },
                },
                {
                  path: '/projects/definition/list/timing/:id',
                  name: 'definition-timing-details',
                  component: (resolve) => require(['@/view/projects/pages/definition/timing/index'], resolve),
                  meta: {
                    title: `${i18n.$t('Scheduled task list')}`,
                    refresh_in_switched_tab: true,
                  },
                },
              ],
            },
            {
              path: '/projects/instance',
              name: 'instance',
              component: (resolve) => require(['@/view/projects/pages/instance/ProjectsInstance'], resolve),
              meta: {
                title: `${i18n.$t('Process Instance')}`,
              },
              redirect: {
                name: 'projects-instance-list',
              },
              children: [
                {
                  path: '/projects/instance/list',
                  name: 'projects-instance-list',
                  component: (resolve) => require(['@/view/projects/pages/instance/pages/list/index'], resolve),
                  meta: {
                    title: `${i18n.$t('Process Instance')}`,
                    refresh_in_switched_tab: true,
                  },
                },
                {
                  path: '/projects/instance/list/:id',
                  name: 'projects-instance-details',
                  component: (resolve) => require(['@/view/projects/pages/instance/pages/details/index'], resolve),
                  meta: {
                    title: `${i18n.$t('Process instance details')}`,
                    refresh_in_switched_tab: true,
                  },
                },
                {
                  path: '/projects/instance/gantt/:id',
                  name: 'instance-gantt-index',
                  component: (resolve) => require(['@/view/projects/pages/instance/pages/gantt/index'], resolve),
                  meta: {
                    title: `${i18n.$t('Gantt')}`,
                    refresh_in_switched_tab: true,
                  },
                },
              ],
            },
            {
              path: '/projects/task-instance',
              name: 'task-instance',
              component: (resolve) => require(['@/view/projects/pages/taskInstance/ProjectsTaskInstance'], resolve),
              meta: {
                title: `${i18n.$t('Task Instance')}`,
                refresh_in_switched_tab: true,
              },
            },
            {
              path: '/projects/task-record',
              name: 'task-record',
              component: (resolve) => require(['@/view/projects/pages/taskRecord'], resolve),
              meta: {
                title: `${i18n.$t('Task record')}`,
                refresh_in_switched_tab: true,
              },
            },
            {
              path: '/projects/history-task-record',
              name: 'history-task-record',
              component: (resolve) => require(['@/view/projects/pages/historyTaskRecord'], resolve),
              meta: {
                title: `${i18n.$t('History task record')}`,
                refresh_in_switched_tab: true,
              },
            },
          ],
        },
        {
          path: '/resource',
          name: 'resource',
          component: (resolve) => require(['@/view/resource/Resource'], resolve),
          redirect: {
            name: 'file',
          },
          meta: {
            title: `${i18n.$t('Resources')}`,
            refresh_in_switched_tab: true,
          },
          children: [
            {
              path: '/resource/file',
              name: 'file',
              component: (resolve) => require(['@/view/resource/pages/file/pages/list/index'], resolve),
              meta: {
                title: `${i18n.$t('File Manage')}`,
                refresh_in_switched_tab: true,
              },
            },
            {
              path: '/resource/file/create',
              name: 'resource-file-create',
              component: (resolve) => require(['@/view/resource/pages/file/pages/create/index'], resolve),
              meta: {
                title: `${i18n.$t('Create Resource')}`,
              },
            },
            {
              path: '/resource/file/createFolder',
              name: 'resource-file-createFolder',
              component: (resolve) => require(['@/view/resource/pages/file/pages/createFolder/index'], resolve),
              meta: {
                title: `${i18n.$t('Create Resource')}`,
              },
            },
            {
              path: '/resource/file/subFileFolder/:id',
              name: 'resource-file-subFileFolder',
              component: (resolve) => require(['@/view/resource/pages/file/pages/subFileFolder/index'], resolve),
              meta: {
                title: `${i18n.$t('Create Resource')}`,
                refresh_in_switched_tab: true,
              },
            },
            {
              path: '/resource/file/subFile/:id',
              name: 'resource-file-subFile',
              component: (resolve) => require(['@/view/resource/pages/file/pages/subFile/index'], resolve),
              meta: {
                title: `${i18n.$t('Create Resource')}`,
                refresh_in_switched_tab: true,
              },
            },
            {
              path: '/resource/file/list/:id',
              name: 'resource-file-details',
              component: (resolve) => require(['@/view/resource/pages/file/pages/details/index'], resolve),
              meta: {
                title: `${i18n.$t('File Details')}`,
                refresh_in_switched_tab: true,
              },
            },
            {
              path: '/resource/file/subdirectory/:id',
              name: 'resource-file-subdirectory',
              component: (resolve) => require(['@/view/resource/pages/file/pages/subdirectory/index'], resolve),
              meta: {
                title: `${i18n.$t('File Manage')}`,
                refresh_in_switched_tab: true,
              },
            },
            {
              path: '/resource/file/edit/:id',
              name: 'resource-file-edit',
              component: (resolve) => require(['@/view/resource/pages/file/pages/edit/index'], resolve),
              meta: {
                title: `${i18n.$t('File Details')}`,
              },
            },
            {
              path: '/resource/udf',
              name: 'udf',
              component: (resolve) => require(['@/view/resource/pages/udf/index'], resolve),
              meta: {
                title: `${i18n.$t('UDF manage')}`,
                refresh_in_switched_tab: true,
              },
              children: [
                {
                  path: '/resource/udf',
                  name: 'resource-udf',
                  component: (resolve) => require(['@/view/resource/pages/udf/pages/resource/index'], resolve),
                  meta: {
                    title: `${i18n.$t('UDF Resources')}`,
                    refresh_in_switched_tab: true,
                  },
                },
                {
                  path: '/resource/udf/subUdfDirectory/:id',
                  name: 'resource-udf-subUdfDirectory',
                  component: (resolve) => require(['@/view/resource/pages/udf/pages/subUdfDirectory/index'], resolve),
                  meta: {
                    title: `${i18n.$t('UDF Resources')}`,
                    refresh_in_switched_tab: true,
                  },
                },
                {
                  path: '/resource/udf/createUdfFolder',
                  name: 'resource-udf-createUdfFolder',
                  component: (resolve) => require(['@/view/resource/pages/udf/pages/createUdfFolder/index'], resolve),
                  meta: {
                    title: `${i18n.$t('Create Resource')}`,
                  },
                },
                {
                  path: '/resource/udf/subCreateUdfFolder/:id',
                  name: 'resource-udf-subCreateUdfFolder',
                  component: (resolve) => require(['@/view/resource/pages/udf/pages/subUdfFolder/index'], resolve),
                  meta: {
                    title: `${i18n.$t('Create Resource')}`,
                  },
                },
                {
                  path: '/resource/func',
                  name: 'resource-func',
                  component: (resolve) => require(['@/view/resource/pages/udf/pages/function/index'], resolve),
                  meta: {
                    title: `${i18n.$t('UDF Function')}`,
                  },
                },
              ],
            },
          ],
        },
        {
          path: '/dataSource',
          name: 'dataSource',
          component: (resolve) => require(['@/view/dataSource/DataSource'], resolve),
          meta: {
            title: `${i18n.$t('Datasource')}`,
          },
          redirect: {
            name: 'dataSource-list',
          },
          children: [
            {
              path: '/dataSource/list',
              name: 'dataSource-list',
              component: (resolve) => require(['@/view/dataSource/pages/list/index'], resolve),
              meta: {
                title: `${i18n.$t('Datasource')}`,
              },
            },
          ],
        },
        {
          path: '/security',
          name: 'security',
          component: (resolve) => require(['@/view/security/Security'], resolve),
          meta: {
            title: `${i18n.$t('Security')}`,
          },
          redirect: {
            name: 'tenement-manage',
          },
          children: [
            {
              path: '/security/tenant',
              name: 'tenement-manage',
              component: (resolve) => require(['@/view/security/pages/tenement/index'], resolve),
              meta: {
                title: `${i18n.$t('Tenant Manage')}`,
              },
            },
            {
              path: '/security/users',
              name: 'users-manage',
              component: (resolve) => require(['@/view/security/pages/users/index'], resolve),
              meta: {
                title: `${i18n.$t('User Manage')}`,
                refresh_in_switched_tab: true,
              },
            },
            {
              path: '/security/warning-groups',
              name: 'warning-groups-manage',
              component: (resolve) => require(['@/view/security/pages/warningGroups/index'], resolve),
              meta: {
                title: `${i18n.$t('Warning group manage')}`,
              },
            },
            {
              path: '/security/warning-instance',
              name: 'warning-instance-manage',
              component: (resolve) => require(['@/view/security/pages/warningInstance/index'], resolve),
              meta: {
                title: `${i18n.$t('Warning instance manage')}`,
              },
            },
            {
              path: '/security/queue',
              name: 'queue-manage',
              component: (resolve) => require(['@/view/security/pages/queue/index'], resolve),
              meta: {
                title: `${i18n.$t('Queue manage')}`,
              },
            },
            {
              path: '/security/worker-groups',
              name: 'worker-groups-manage',
              component: (resolve) => require(['@/view/security/pages/workerGroups/index'], resolve),
              meta: {
                title: `${i18n.$t('Worker group manage')}`,
              },
            },
            {
              path: '/security/token',
              name: 'token-manage',
              component: (resolve) => require(['@/view/security/pages/token/index'], resolve),
              meta: {
                title: `${i18n.$t('Token manage')}`,
              },
            },
          ],
        },
        {
          path: '/dataQuality',
          name: 'dataQuality',
          component: (resolve) => require(['@/view/dataQuality/DataQuality'], resolve),
          meta: {
            title: `${i18n.$t('DataQuality')}`,
          },
          redirect: {
            name: 'data-quality-result',
          },
          children: [
            {
              path: '/dataQuality/result',
              name: 'data-quality-result',
              component: (resolve) => require(['@/view/dataQuality/pages/result/Result'], resolve),
              meta: {
                title: `${i18n.$t('DataQuality Result')}`,
              },
            },
            {
              path: '/dataQuality/rule',
              name: 'data-quality-rule',
              component: (resolve) => require(['@/view/dataQuality/pages/rule/Rule'], resolve),
              meta: {
                title: `${i18n.$t('DataQuality Rule')}`,
              },
            },
          ],
        },
        {
          path: '/user',
          name: 'user',
          component: (resolve) => require(['@/view/user/index'], resolve),
          meta: {
            title: `${i18n.$t('User Center')}`,
          },
          redirect: {
            name: 'account',
          },
          children: [
            {
              path: '/user/account',
              name: 'account',
              component: (resolve) => require(['@/view/user/pages/account/index'], resolve),
              meta: {
                title: `${i18n.$t('User Information')}`,
              },
            },
            {
              path: '/user/password',
              name: 'password',
              component: (resolve) => require(['@/view/user/pages/password/index'], resolve),
              meta: {
                title: `${i18n.$t('Edit password')}`,
              },
            },
            {
              path: '/user/token',
              name: 'token',
              component: (resolve) => require(['@/view/user/pages/token/index'], resolve),
              meta: {
                title: `${i18n.$t('Token manage')}`,
              },
            },
          ],
        },
        {
          path: '/monitor',
          name: 'monitor',
          component: (resolve) => require(['@/view/monitor/Monitor'], resolve),
          meta: {
            title: 'monitor',
          },
          redirect: {
            name: 'servers-master',
          },
          children: [
            {
              path: '/monitor/servers/master',
              name: 'servers-master',
              component: (resolve) => require(['@/view/monitor/pages/servers/master'], resolve),
              meta: {
                title: `${i18n.$t('Service-Master')}`,
                refresh_in_switched_tab: true,
              },
            },
            {
              path: '/monitor/servers/worker',
              name: 'servers-worker',
              component: (resolve) => require(['@/view/monitor/pages/servers/worker'], resolve),
              meta: {
                title: `${i18n.$t('Service-Worker')}`,
                refresh_in_switched_tab: true,
              },
            },
            {
              path: '/monitor/servers/alert',
              name: 'servers-alert',
              component: (resolve) => require(['@/view/monitor/pages/servers/alert'], resolve),
              meta: {
                title: 'Alert',
                refresh_in_switched_tab: true,
              },
            },
            {
              path: '/monitor/servers/rpcserver',
              name: 'servers-rpcserver',
              component: (resolve) => require(['@/view/monitor/pages/servers/rpcserver'], resolve),
              meta: {
                title: 'Rpcserver',
                refresh_in_switched_tab: true,
              },
            },
            {
              path: '/monitor/servers/zookeeper',
              name: 'servers-zookeeper',
              component: (resolve) => require(['@/view/monitor/pages/servers/zookeeper'], resolve),
              meta: {
                title: 'Zookeeper',
                refresh_in_switched_tab: true,
              },
            },
            {
              path: '/monitor/servers/apiserver',
              name: 'servers-apiserver',
              component: (resolve) => require(['@/view/monitor/pages/servers/apiserver'], resolve),
              meta: {
                title: 'Apiserver',
                refresh_in_switched_tab: true,
              },
            },
            {
              path: '/monitor/servers/db',
              name: 'servers-db',
              component: (resolve) => require(['@/view/monitor/pages/servers/db'], resolve),
              meta: {
                title: 'DB',
                refresh_in_switched_tab: true,
              },
            },
            {
              path: '/monitor/servers/statistics',
              name: 'statistics',
              component: (resolve) => require(['@/view/monitor/pages/servers/statistics'], resolve),
              meta: {
                title: 'statistics',
                refresh_in_switched_tab: true,
              },
            },
          ],
        },
      ],
    },
  ],
})

const VueRouterPush = Router.prototype.push
Router.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch((err) => err)
}

router.beforeEach((to, from, next) => {
  // const $body = $('body')
  // $body.find('.tooltip.fade.top.in').remove()
  if (to.meta.title) {
    document.title = `${to.meta.title} - DolphinScheduler`
  }
  next()
})

export default router
