class ApiFeatures{
    constructor (query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }

    filter(){
        const queryObj = {...this.queryStr};
        const excludedFeild =['page','sort','limit','fields'];
        excludedFeild.forEach(el=>delete queryObj[el]);

        //2 Advanced filtering 
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
        queryStr=JSON.parse(queryStr);

        this.query.find(queryStr);
        return this;   
    }
    sort(){
        
        if(this.queryStr.sort){
            let sortBy = this.queryStr.sort.split(',').join(' ');
            this.query= this.query.sort(sortBy);
        }
        else{ 
           this.query = this.query.sort("-createdAt");
        }
        return this;
    }
    limitFields(){
        if(this.queryStr.fields){
            let fields = this.queryStr.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        }
        else{
            this.query.select('-__v');
        }
        return this;
    }
    Paginate(){
        const page = this.queryStr.page*1 ||1;
        const limit = this.queryStr.limit*1 || 100;
        const skip = (page-1)*limit;
        this.query= this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = ApiFeatures;