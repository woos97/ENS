const express = require('express')
const router = express.Router()

const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: process.env.host,
    pool : process.env.port,
    user : process.env.user,
    password : process.env.password,
    database : process.env.database
})



module.exports = function(){
    //조회수 증가하는 function
    // function viewincrement(_bno){
    //     const sql =`
    //         update contents set
    //         count = count + 1
    //         where
    //         bo_no = ?
    //     `
    //     const values = _bno
    //     connection.query(
    //         sql,
    //         values,
    //         function(err, result){
    //             if(err){
    //                 console.log(err)
    //             }
    //         }
    //     )
    // }

    // 글쓰기를 눌렀을때 글쓰기 폼으로 이동
    router.post('/writer', function(req, res){
        const wallet = req.body.wallet
        console.log(wallet)
        const sql = `
            select u.id, n.ensname from testenn.users u 
            left join testenn.nfts n on u.active_nft_id = n.id
            where u.wallet = ?
        `
        connection.query (
            sql,
            wallet,
            function(err, result){
                if(err){
                    console.log(err)
                }else{
                    console.log(result)
                    res.send( {
                        data : result
                    })
                }
            }
        )
    })
    // localhost:3000/board 요청이 들어올시 게시판 목록
    // posts.*  nfts.ensname, comments_coutn 반환
    router.get('/', function(req, res){
        const sql = `
            select p.*, n.ensname,(
            SELECT COUNT(*) FROM testenn.comments c
            WHERE c.post_id = p.id GROUP BY "http://localhost:4000"
            ) as commnet_count from testenn.posts p
            left join testenn.users u on p.writer_user_id = u.id
            left join testenn.nfts n on u.active_nft_id = n.id
            order by created_at desc;
        `
        connection.query(
            sql,
            function(err , result){
                if(err){
                    console.log(err)
                    res.send(err)
                }else{
                    console.log(result)
                    res.send({
                        data : result
                    })
                }
            }
        )
        })
    // 상세보기 눌렀을때마다 조회수 증가 해당 글번호를 가져와 보여주고
    // 지갑주소를 가져와 ensname을 보여주기 위해 POST 방식으로 받음
    router.post('/boardDetail', function(req, res){
        const id = req.body.id
        const wallet = req.body.wallet
        console.log("id : " + id)
        console.log("wallet : " + wallet)

        let sql = `
            select p.*, n.ensname from testenn.posts p
            left join testenn.users u on p.writer_user_id = u.id
            left join testenn.nfts n on u.active_nft_id = n.id
            where p.id = ?
        `
        connection.query(
            sql,
            id,
            async function(err, posts){
                if(err){
                    console.log(err)
                }else{
                    
                    sql = `
                        select c.*, n.ensname from testenn.comments c
                        left join testenn.users u on c.writer_user_id = u.id
                        left join testenn.nfts n on u.active_nft_id = n.id
                        where c.post_id = ?
                        order by created_at desc
                    `
                    connection.query(
                        sql,
                        id,
                        async function(err, comments){
                            if(err){
                                console.log(err)
                            }else{
                                
                                sql = `
                                    select u.id, n.ensname from testenn.users u
                                    left join testenn.nfts n on u.active_nft_id = n.id
                                    where u.wallet = ?                                 
                                `
                                connection.query(
                                    sql,
                                    wallet,
                                    async function(err, ensname){
                                        if(err){
                                            console.log(err)
                                        }else{
                                            console.log(ensname)
                                            res.send({
                                                'posts' : posts[0],
                                                'comments' : comments,
                                                'myname' : ensname
                                            })
                                        }
                                    }
                                )
                                
                            }
                        }
                    )
                }
            }
        )        
    })

    // 글쓰기버튼을 누를때 writer는 users.id가 넘어와야됨
    router.post('/boardregister', function(req, res){
        const writer = req.body.user_id
        const title = req.body._title
        const content = req.body._content
        console.log(writer)
        console.log(title)
        console.log(content)

        const sql =`
            insert
            into
            testenn.posts(writer_user_id, contents, created_at, title)
            values
            (?, ?, now(), ?)
        `
        const values = [writer, content, title]

        connection.query(
            sql,
            values,
            function(err, result){
                if(err){
                    console.log(err)
                }else{
                    res.send("작성완료")
                }
            }
        )
    })
    // 글 삭제
    router.get('/contentdel?', function(req, res){
        const id = req.query.id
        console.log("asdfasdfasdfa"+id)
        const sql =`
            delete 
            from 
            testenn.posts
            where
            id = ?
        `
        connection.query(
            sql,
            id,
            function(err, result){
                if(err){
                    console.log(err)

                }else{
                    res.send('삭제완료')
                }
            })
        
    })
    // 글 수정 폼
    router.get('/contentup?', function(req, res){
        const id = req.query.id
        console.log("#####################"+id)

        const sql = `
            select p.*, n.ensname from testenn.posts p
            left join testenn.users u on p.writer_user_id = u.id
            left join testenn.nfts n on u.active_nft_id = n.id
            where p.id = ?
        `
        connection.query(
            sql,
            id,
            function(err, result){
                if(err){
                    console.log(err)
                }else{
                    res.send({
                        data : result[0]
                    })
                }
            }
        )
    })
    // 글 수정
    router.post('/boardup', function(req, res){
        const id = req.body._id
        const content = req.body._content
        const fdf = [id,content]
        console.log(fdf)

        const sql =`
            update 
            testenn.posts
            set
            contents = ?,
            updated_at = now()
            where
            id = ?
        `   
        const values = [content, id]

        connection.query(
            sql,
            values,
            function(err, result){
                if(err){
                    console.log(err)
                }else{
                    console.log(result)
                    res.send("수정완료")
                }
            }
        )
    })

    //comment 등록 
    router.post("/commentAdd", function(req, res){
        const content   = req.body.content
        const writer_id = req.body.writer_id
        const post_id   = req.body.post_id

        console.log({content, writer_id, post_id})

        const sql =`
            insert into testenn.comments
            (contents, writer_user_id, post_id, created_at)
            values (?, ?, ?, now())
        `
        const values = [content, writer_id, post_id]
        connection.query(
            sql,
            values,
            function(err, result){
                if(err){
                    console.log(err)
                }else{
                    res.send("댓글작성완료")
                }
            }
        )
    })
    // return 값이 없으면 Route() 미들웨어함수 오류
    return router
}