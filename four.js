/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
//第4道题 两个数组的中位数
var findMedianSortedArrays = function(nums1, nums2) {
    var length1=nums1.length,length2=nums2.length;
    var b1,b2,arrb1=0,arrb2=0,sun;
    //得到两个数组中位数的索引
    if ((length1+length2+1)%2) {
        //数组中的个数为偶数，所以为中间的那个
        b1=Math.floor((length1+length2+1)/2);
        b2=b1+1;
    }else{
        b1=(length1+length2+1)/2;
        b2=-1;
    }
    //目的：得到中位数
    var is_w;
    console.log(b1);
    console.log(b2);
    if (b2>=0){
        //总数为偶数
        for(var i=0;i<b1+1;i++){
            if(arrb1>=length1){
                if (i==(b1-1)){
                    n=nums2[arrb2];
                }
                m=nums2[arrb2];
                arrb2++;
            }else if(arrb2>=length2){
                if (i==(b1-1)){
                    n=nums1[arrb1];
                }
                m=nums1[arrb1];
                arrb1++;
            }else{
                if(nums1[arrb1]>nums2[arrb2]){
                    if (i==(b1-1)){
                        n=nums2[arrb2];
                    }
                    m=nums2[arrb2];
                    arrb2++;
                }else if(nums1[arrb1]<nums2[arrb2]){
                    if (i==(b1-1)){
                        n=nums1[arrb1];
                    }
                    m=nums1[arrb1];
                    arrb1++;
                }else if(nums1[arrb1]==nums2[arrb2]){

                    if (i==(b1-1)){
                        n=nums1[arrb1];;
                    }
                    m=nums1[arrb1];
                    arrb2++;
                    arrb1++;
                    i++;

                    if (i==(b1-1)){
                        n=nums1[arrb1-1];
                    }
                }
            }
        }
        console.log(m);
        console.log(n);
        sun=(m+n)/2;
    }else{
        //总数为奇数
        for(var i=0;i<b1;i++){
            if(arrb1>=length1){
                n=nums2[arrb2];
                arrb2++;
            }else if(arrb2>=length2){
                n=nums1[arrb1];
                arrb1++;
            }else{

                if(nums1[arrb1]>nums2[arrb2]){
                    n=nums2[arrb2];
                    arrb2++;
                }else if(nums1[arrb1]<nums2[arrb2]){
                    n=nums1[arrb1];
                    arrb1++;
                }else if(nums1[arrb1]==nums2[arrb2]){
                    n=nums1[arrb1];
                    arrb2++;
                    arrb1++;
                    i++;
                }
            }

        }
        sun=n;
    }
    var n,m;
    console.log(sun);
    return sun;
};
var num1=[1];
var num2=[2,3];
findMedianSortedArrays(num1,num2);