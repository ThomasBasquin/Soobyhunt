<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<User>
 *
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function save(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

   public function findByTeam(User $user, $latMin, $latMax, $lngMin, $lngMax)
   {
       return $this->createQueryBuilder('u')
           ->andWhere('u.team = :team')
           ->orWhere('u.latitude > :latMin and u.latitude < :latMax and u.longitude > :lngMin and u.longitude < :lngMax')
           ->setParameter('latMin', $latMin)
           ->setParameter('latMax', $latMax)
           ->setParameter('lngMin', $lngMin)
           ->setParameter('lngMax', $lngMax)
           ->setParameter('team', $user->getTeam())
           ->getQuery()
           ->getResult()
       ;
   }
   public function findWhoSeeItem($latMin, $latMax, $lngMin, $lngMax)
   {
       return $this->createQueryBuilder('u')
           ->where('u.latitude > :latMin and u.latitude < :latMax and u.longitude > :lngMin and u.longitude < :lngMax')
           ->setParameter('latMin', $latMin)
           ->setParameter('latMax', $latMax)
           ->setParameter('lngMin', $lngMin)
           ->setParameter('lngMax', $lngMax)
           ->getQuery()
           ->getResult()
       ;
   }

//    public function findOneBySomeField($value): ?User
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
