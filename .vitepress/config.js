
    import { defineConfig } from "vitepress";
    export default defineConfig({
    "lang": "zh-CN",
    "head": [
        [
            "script",
            {
                "type": "text/javascript"
            },
            "(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src=\"https://www.clarity.ms/tag/\"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, \"clarity\", \"script\", \"rw559jeiha\");"
        ],
        [
            "link",
            {
                "rel": "icon",
                "href": "/favicon/android-chrome-192x192.png",
                "sizes": "192x192"
            }
        ],
        [
            "link",
            {
                "rel": "icon",
                "href": "/favicon/android-chrome-512x512.png",
                "sizes": "512x512"
            }
        ],
        [
            "link",
            {
                "rel": "apple-touch-icon",
                "href": "/favicon/apple-touch-icon.png"
            }
        ],
        [
            "link",
            {
                "rel": "icon",
                "href": "/favicon/favicon-32x32.png",
                "sizes": "32x32"
            }
        ],
        [
            "link",
            {
                "rel": "icon",
                "href": "/favicon/favicon-16x16.png",
                "sizes": "16x16"
            }
        ],
        [
            "link",
            {
                "rel": "shortcut icon",
                "href": "/favicon/favicon.ico"
            }
        ],
        [
            "meta",
            {
                "name": "keywords",
                "content": "VitePress, Blog, 前端, 开发, 技术, JavaScript, Node.js, Linux, Docker, SQL, Git"
            }
        ],
        [
            "meta",
            {
                "name": "description",
                "content": "🌕🌖🌗🌘🌑🌒🌓🌔的个人技术博客，分享前端、和开发工具相关的知识与经验。"
            }
        ],
        [
            "meta",
            {
                "name": "author",
                "content": "🌕🌖🌗🌘🌑🌒🌓🌔"
            }
        ],
        [
            "meta",
            {
                "name": "viewport",
                "content": "width=device-width, initial-scale=1.0"
            }
        ]
    ],
    "title": "🌕🌖🌗🌘🌑🌒🌓🌔's Blog",
    "description": "🌕🌖🌗🌘🌑🌒🌓🌔's Blog, Powered by VitePress",
    "themeConfig": {
        "search": {
            "provider": "local"
        },
        "nav": [
            {
                "text": "首页",
                "link": "/"
            },
            {
                "text": "集合",
                "items": [
                    {
                        "text": "Start",
                        "link": "/start/markdown"
                    },
                    {
                        "text": "HTTP",
                        "link": "/http/tcp"
                    },
                    {
                        "text": "JS",
                        "link": "/js/ajax"
                    },
                    {
                        "text": "Git",
                        "link": "/git/git"
                    },
                    {
                        "text": "Node",
                        "link": "/node/node"
                    },
                    {
                        "text": "Media",
                        "link": "/media/pngquant"
                    },
                    {
                        "text": "SQL",
                        "link": "/sql/mysql"
                    },
                    {
                        "text": "Linux",
                        "link": "/linux/linux"
                    },
                    {
                        "text": "Docker",
                        "link": "/docker/docker"
                    },
                    {
                        "text": "Util",
                        "link": "/util/ohmyzsh"
                    }
                ]
            },
            {
                "text": "关于",
                "link": "/about"
            }
        ],
        "darkModeSwitchLabel": "主题",
        "sidebarMenuLabel": "菜单列表",
        "docFooter": {
            "prev": "上一页",
            "next": "下一页"
        },
        "sidebar": {
            "/AI/": [
                {
                    "text": "AI",
                    "collapsed": false,
                    "items": [
                        {
                            "text": "index",
                            "link": "/AI/index"
                        }
                    ]
                }
            ],
            "/about/": [
                {
                    "text": "about",
                    "collapsed": false,
                    "items": [
                        {
                            "text": "index",
                            "link": "/about/index"
                        }
                    ]
                }
            ],
            "/demo/": [
                {
                    "text": "demo",
                    "collapsed": false,
                    "items": [
                        {
                            "text": "blobPreview",
                            "link": "/demo/blobPreview"
                        },
                        {
                            "text": "cameraPreview",
                            "link": "/demo/cameraPreview"
                        },
                        {
                            "text": "cpcl",
                            "link": "/demo/cpcl"
                        },
                        {
                            "text": "jsbarcode",
                            "link": "/demo/jsbarcode"
                        },
                        {
                            "text": "json",
                            "link": "/demo/json"
                        },
                        {
                            "text": "shortLink",
                            "link": "/demo/shortLink"
                        },
                        {
                            "text": "watermark",
                            "link": "/demo/watermark"
                        }
                    ]
                }
            ],
            "/docker/": [
                {
                    "text": "docker",
                    "collapsed": false,
                    "items": [
                        {
                            "text": "docker",
                            "link": "/docker/docker"
                        }
                    ]
                }
            ],
            "/examples/": [
                {
                    "text": "examples",
                    "collapsed": false,
                    "items": [
                        {
                            "text": "api-examples",
                            "link": "/examples/api-examples"
                        },
                        {
                            "text": "markdown-examples",
                            "link": "/examples/markdown-examples"
                        }
                    ]
                }
            ],
            "/flutter/": [
                {
                    "text": "flutter",
                    "collapsed": false,
                    "items": [
                        {
                            "text": "dart",
                            "link": "/flutter/dart"
                        },
                        {
                            "text": "dartpad",
                            "link": "/flutter/dartpad"
                        },
                        {
                            "text": "freezed",
                            "link": "/flutter/freezed"
                        },
                        {
                            "text": "fvm",
                            "link": "/flutter/fvm"
                        },
                        {
                            "text": "hooks_riverpod",
                            "link": "/flutter/hooks_riverpod"
                        },
                        {
                            "text": "index",
                            "link": "/flutter/index"
                        },
                        {
                            "text": "intl",
                            "link": "/flutter/intl"
                        },
                        {
                            "text": "io",
                            "link": "/flutter/io"
                        },
                        {
                            "text": "keytool",
                            "link": "/flutter/keytool"
                        },
                        {
                            "text": "pub",
                            "link": "/flutter/pub"
                        },
                        {
                            "text": "sdkman",
                            "link": "/flutter/sdkman"
                        },
                        {
                            "text": "widget",
                            "link": "/flutter/widget"
                        }
                    ]
                }
            ],
            "/git/": [
                {
                    "text": "git",
                    "collapsed": false,
                    "items": [
                        {
                            "text": "git",
                            "link": "/git/git"
                        },
                        {
                            "text": "github-pages",
                            "link": "/git/github-pages"
                        }
                    ]
                }
            ],
            "/http/": [
                {
                    "text": "http",
                    "collapsed": false,
                    "items": [
                        {
                            "text": "cache",
                            "link": "/http/cache"
                        },
                        {
                            "text": "caddy",
                            "link": "/http/caddy"
                        },
                        {
                            "text": "dns",
                            "link": "/http/dns"
                        },
                        {
                            "text": "http",
                            "link": "/http/http"
                        },
                        {
                            "text": "network",
                            "link": "/http/network"
                        },
                        {
                            "text": "nginx",
                            "link": "/http/nginx"
                        },
                        {
                            "text": "security",
                            "link": "/http/security"
                        },
                        {
                            "text": "serverLess",
                            "link": "/http/serverLess"
                        },
                        {
                            "text": "socket.io",
                            "link": "/http/socket.io"
                        },
                        {
                            "text": "tcp",
                            "link": "/http/tcp"
                        },
                        {
                            "text": "tsl&ssl",
                            "link": "/http/tsl&ssl"
                        },
                        {
                            "text": "webSocket",
                            "link": "/http/webSocket"
                        }
                    ]
                }
            ],
            "/jenkins/": [
                {
                    "text": "jenkins",
                    "collapsed": false,
                    "items": [
                        {
                            "text": "index",
                            "link": "/jenkins/index"
                        }
                    ]
                }
            ],
            "/js/": [
                {
                    "text": "js",
                    "collapsed": false,
                    "items": [
                        {
                            "text": "ajax",
                            "link": "/js/ajax"
                        },
                        {
                            "text": "ali-oss",
                            "link": "/js/ali-oss"
                        },
                        {
                            "text": "amis",
                            "link": "/js/amis"
                        },
                        {
                            "text": "blob",
                            "link": "/js/blob"
                        },
                        {
                            "text": "cross-domain",
                            "link": "/js/cross-domain"
                        },
                        {
                            "text": "decimal.js",
                            "link": "/js/decimal.js"
                        },
                        {
                            "text": "eventLoop",
                            "link": "/js/eventLoop"
                        },
                        {
                            "text": "mockjs",
                            "link": "/js/mockjs"
                        },
                        {
                            "text": "n",
                            "link": "/js/n"
                        },
                        {
                            "text": "nanoid",
                            "link": "/js/nanoid"
                        },
                        {
                            "text": "navigator.sendBeacon",
                            "link": "/js/navigator.sendBeacon"
                        },
                        {
                            "text": "promise",
                            "link": "/js/promise"
                        },
                        {
                            "text": "prototype",
                            "link": "/js/prototype"
                        },
                        {
                            "text": "qrcode",
                            "link": "/js/qrcode"
                        },
                        {
                            "text": "react",
                            "link": "/js/react"
                        },
                        {
                            "text": "router",
                            "link": "/js/router"
                        },
                        {
                            "text": "typescript",
                            "link": "/js/typescript"
                        },
                        {
                            "text": "vite",
                            "link": "/js/vite"
                        },
                        {
                            "text": "xlsx",
                            "link": "/js/xlsx"
                        }
                    ]
                }
            ],
            "/linux/": [
                {
                    "text": "linux",
                    "collapsed": false,
                    "items": [
                        {
                            "text": "corntab",
                            "link": "/linux/corntab"
                        },
                        {
                            "text": "ftp",
                            "link": "/linux/ftp"
                        },
                        {
                            "text": "linux",
                            "link": "/linux/linux"
                        },
                        {
                            "text": "ssh",
                            "link": "/linux/ssh"
                        },
                        {
                            "text": "tree",
                            "link": "/linux/tree"
                        },
                        {
                            "text": "vi&vim",
                            "link": "/linux/vi&vim"
                        },
                        {
                            "text": "yum&dnf&apt",
                            "link": "/linux/yum&dnf&apt"
                        },
                        {
                            "text": "zip&gzip&xz&tar",
                            "link": "/linux/zip&gzip&xz&tar"
                        }
                    ]
                }
            ],
            "/media/": [
                {
                    "text": "media",
                    "collapsed": false,
                    "items": [
                        {
                            "text": "ffmpeg",
                            "link": "/media/ffmpeg"
                        },
                        {
                            "text": "pngquant",
                            "link": "/media/pngquant"
                        }
                    ]
                }
            ],
            "/node/": [
                {
                    "text": "node",
                    "collapsed": false,
                    "items": [
                        {
                            "text": "browser-sync",
                            "link": "/node/browser-sync"
                        },
                        {
                            "text": "cli",
                            "link": "/node/cli"
                        },
                        {
                            "text": "ejs",
                            "link": "/node/ejs"
                        },
                        {
                            "text": "express-cache",
                            "link": "/node/express-cache"
                        },
                        {
                            "text": "express",
                            "link": "/node/express"
                        },
                        {
                            "text": "ioredis",
                            "link": "/node/ioredis"
                        },
                        {
                            "text": "jwt",
                            "link": "/node/jwt"
                        },
                        {
                            "text": "lua",
                            "link": "/node/lua"
                        },
                        {
                            "text": "marked",
                            "link": "/node/marked"
                        },
                        {
                            "text": "multer",
                            "link": "/node/multer"
                        },
                        {
                            "text": "node-schedule",
                            "link": "/node/node-schedule"
                        },
                        {
                            "text": "node",
                            "link": "/node/node"
                        },
                        {
                            "text": "npm&yarn&npx&pnpm",
                            "link": "/node/npm&yarn&npx&pnpm"
                        },
                        {
                            "text": "pm2",
                            "link": "/node/pm2"
                        },
                        {
                            "text": "puppeteer",
                            "link": "/node/puppeteer"
                        },
                        {
                            "text": "reptile",
                            "link": "/node/reptile"
                        }
                    ]
                }
            ],
            "/python/": [
                {
                    "text": "python",
                    "collapsed": false,
                    "items": [
                        {
                            "text": "DrissionPage",
                            "link": "/python/DrissionPage"
                        },
                        {
                            "text": "index",
                            "link": "/python/index"
                        },
                        {
                            "text": "jieba",
                            "link": "/python/jieba"
                        },
                        {
                            "text": "wordcloud",
                            "link": "/python/wordcloud"
                        }
                    ]
                }
            ],
            "/sql/": [
                {
                    "text": "sql",
                    "collapsed": false,
                    "items": [
                        {
                            "text": "SQLServer",
                            "link": "/sql/SQLServer"
                        },
                        {
                            "text": "knex",
                            "link": "/sql/knex"
                        },
                        {
                            "text": "mysql",
                            "link": "/sql/mysql"
                        },
                        {
                            "text": "postgresql",
                            "link": "/sql/postgresql"
                        },
                        {
                            "text": "prisma",
                            "link": "/sql/prisma"
                        },
                        {
                            "text": "redis",
                            "link": "/sql/redis"
                        },
                        {
                            "text": "sqlite3",
                            "link": "/sql/sqlite3"
                        }
                    ]
                }
            ],
            "/start/": [
                {
                    "text": "start",
                    "collapsed": false,
                    "items": [
                        {
                            "text": "markdown",
                            "link": "/start/markdown"
                        },
                        {
                            "text": "schema",
                            "link": "/start/schema"
                        },
                        {
                            "text": "upload",
                            "link": "/start/upload"
                        },
                        {
                            "text": "virtual",
                            "link": "/start/virtual"
                        },
                        {
                            "text": "wordpress",
                            "link": "/start/wordpress"
                        }
                    ]
                }
            ],
            "/uniapp/": [
                {
                    "text": "uniapp",
                    "collapsed": false,
                    "items": [
                        {
                            "text": "index",
                            "link": "/uniapp/index"
                        }
                    ]
                }
            ],
            "/util/": [
                {
                    "text": "util",
                    "collapsed": false,
                    "items": [
                        {
                            "text": "1Panel",
                            "link": "/util/1Panel"
                        },
                        {
                            "text": "RegularExpressions",
                            "link": "/util/RegularExpressions"
                        },
                        {
                            "text": "baota",
                            "link": "/util/baota"
                        },
                        {
                            "text": "clarity",
                            "link": "/util/clarity"
                        },
                        {
                            "text": "email",
                            "link": "/util/email"
                        },
                        {
                            "text": "ewomail",
                            "link": "/util/ewomail"
                        },
                        {
                            "text": "exiftool",
                            "link": "/util/exiftool"
                        },
                        {
                            "text": "fangfanggezi",
                            "link": "/util/fangfanggezi"
                        },
                        {
                            "text": "homebrew",
                            "link": "/util/homebrew"
                        },
                        {
                            "text": "localsend",
                            "link": "/util/localsend"
                        },
                        {
                            "text": "ngrok",
                            "link": "/util/ngrok"
                        },
                        {
                            "text": "ohmyzsh",
                            "link": "/util/ohmyzsh"
                        },
                        {
                            "text": "ping",
                            "link": "/util/ping"
                        },
                        {
                            "text": "transformTools",
                            "link": "/util/transformTools"
                        }
                    ]
                }
            ]
        },
        "outline": {
            "level": [
                1,
                6
            ],
            "label": "页面导航"
        },
        "socialLinks": [
            {
                "icon": "github",
                "link": "https://github.com/Ms-150"
            }
        ],
        "footer": {
            "message": "Released under the MIT License.",
            "copyright": "<span class='gradient-text'>Copyright © 2019-2025 </span> 🌕🌖🌗🌘🌑🌒🌓🌔"
        },
        "lastUpdated": {
            "text": "最后更新",
            "formatOptions": {
                "dateStyle": "medium"
            }
        }
    },
    "srcDir": "./src",
    "srcExclude": [
        "**/public/**"
    ],
    "ignoreDeadLinks": true
});
