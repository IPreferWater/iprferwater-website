

import { getAllPostIds, getPostData  } from '../../pages/api/blog'
import Layout from '../../components/Layout'
import AvroConverter from '../../components/blog/AvroConverter';
import TailwindV3 from '../../components/blog/TailwindV3';
import ListWowStyle from '../../components/list-wow-style/ListWowStyle';
import remarkParse from 'remark-parse'
import remarkHtml from 'remark-html'
import {unified} from 'unified'
import { Post } from '../../interfaces';

type BlogProps = {
  postData: Post,
  content: string
}

export default function BlogPost({postData,content}:BlogProps) {
    function getComponent(componentName: string) {
        switch (componentName) {
            case 'avro-to-schema-curl':
              return <AvroConverter/>
              case 'tailwind-v3':
                return <TailwindV3/>
              case 'list-wow-style':
                return <ListWowStyle/>
            default:
              return <div></div>
          }
       }

    return (
      
      <Layout>
          <div className="flex flex-col w-full">
              <div>{postData.title}</div>
              <div>{postData.date}</div>
              <div className='prose prose-xl max-w-none mx-auto prose-img:max-w-sm prose-img:max-h-60 prose-a:underline prose-a:decoration-orange-500 prose-a:decoration-2' dangerouslySetInnerHTML={{__html:content}}/>
              <div >{getComponent(postData.component)}</div>
        </div>
      </Layout>
    )
  }


export async function getStaticProps(params:any) {
  //TODO
    const postData = getPostData(params.params.id)  

    //parse markdown to html
    const parsed = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(postData.content)
    
    //set the html instead of the markdown
    const content = String(parsed)
    
    return {
      props: {
        postData,
        content
      }
    }
  }

export async function getStaticPaths() {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false
  }
}
